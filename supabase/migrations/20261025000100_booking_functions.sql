-- Booking RPCs. Every write that touches the calendar takes one advisory lock (there is one sauna), re-checks
-- availability inside the transaction and then inserts, so concurrent submissions can't double-book.
-- Errors are raised with a short machine-readable message that the server maps to customer-facing copy.
-- Keep the overlap rules in sync with src/lib/server/availability.ts.

create or replace function local_today() returns date
language sql stable set search_path = public as $$
	select (now() at time zone 'America/Vancouver')::date;
$$;

-- Returns null when a rental occupying p_delivery … p_pickup fits the calendar, otherwise the reason it doesn't.
create or replace function rental_conflict(p_delivery date, p_pickup date, p_ignore_rental uuid default null)
returns text
language plpgsql stable set search_path = public as $$
declare
	v_turnaround boolean;
begin
	select same_day_turnaround into v_turnaround from settings;

	-- With turnaround, a pickup in the morning and a delivery that evening can share a day.
	if exists (
		select 1 from rentals r
		where r.status in ('pending', 'confirmed')
			and r.id is distinct from p_ignore_rental
			and case when v_turnaround
				then r.delivery_date < p_pickup and p_delivery < r.pickup_date
				else r.delivery_date <= p_pickup and p_delivery <= r.pickup_date
			end
	) then
		return 'rental_conflict';
	end if;

	-- Drop-ins run in the evening, so with turnaround only the pickup day may fall on a drop-in day.
	if exists (
		select 1 from drop_in_days d
		where d.active
			and case when v_turnaround
				then d.date >= p_delivery and d.date < p_pickup
				else d.date between p_delivery and p_pickup
			end
	) then
		return 'drop_in_conflict';
	end if;

	if exists (select 1 from time_off t where t.start_date <= p_pickup and p_delivery <= t.end_date) then
		return 'time_off';
	end if;

	return null;
end;
$$;

-- Returns null when a drop-in day can run on p_date, otherwise the reason it can't.
create or replace function drop_in_day_conflict(p_date date)
returns text
language plpgsql stable set search_path = public as $$
declare
	v_turnaround boolean;
begin
	select same_day_turnaround into v_turnaround from settings;

	if exists (
		select 1 from rentals r
		where r.status in ('pending', 'confirmed')
			and case when v_turnaround
				then p_date >= r.delivery_date and p_date < r.pickup_date
				else p_date between r.delivery_date and r.pickup_date
			end
	) then
		return 'rental_conflict';
	end if;

	if exists (select 1 from time_off t where p_date between t.start_date and t.end_date) then
		return 'time_off';
	end if;

	return null;
end;
$$;

create or replace function create_rental(
	p_package_id uuid,
	p_delivery_date date,
	p_delivery_time time,
	p_zone_id uuid,
	p_address text,
	p_add_ons jsonb, -- [{ "id": uuid, "quantity": int }]
	p_name text,
	p_email text,
	p_phone text,
	p_notes text default '',
	p_by_admin boolean default false
) returns rentals
language plpgsql set search_path = public as $$
declare
	s settings;
	pkg packages;
	zone delivery_zones;
	addon add_ons;
	item jsonb;
	v_qty int;
	v_pickup date;
	v_conflict text;
	v_items jsonb := '[]';
	v_total int := 0;
	v_rental rentals;
begin
	perform pg_advisory_xact_lock(hashtext('ophir_sauna_calendar'));

	select * into s from settings;

	select * into pkg from packages where id = p_package_id and (active or p_by_admin);
	if not found then
		raise exception 'invalid_package';
	end if;

	select * into zone from delivery_zones where id = p_zone_id and (active or p_by_admin);
	if not found then
		raise exception 'invalid_zone';
	end if;

	v_pickup := p_delivery_date + pkg.nights;

	if not p_by_admin then
		if p_delivery_date <= local_today() then
			raise exception 'too_soon';
		end if;

		if not (extract(isodow from p_delivery_date)::int = any (pkg.allowed_delivery_weekdays)) then
			raise exception 'invalid_weekday';
		end if;

		if p_delivery_time < s.delivery_window_start
			or p_delivery_time > s.delivery_window_end
			or extract(epoch from (p_delivery_time - s.delivery_window_start))::int % (s.delivery_slot_minutes * 60) <> 0 then
			raise exception 'invalid_delivery_time';
		end if;
	end if;

	v_conflict := rental_conflict(p_delivery_date, v_pickup);
	if v_conflict is not null then
		raise exception '%', v_conflict;
	end if;

	v_items := v_items || jsonb_build_object('label', pkg.name, 'quantity', 1, 'unit_cents', pkg.price_cents, 'total_cents', pkg.price_cents);
	v_items := v_items || jsonb_build_object('label', 'Delivery: ' || zone.name, 'quantity', 1, 'unit_cents', zone.price_cents, 'total_cents', zone.price_cents);
	v_total := pkg.price_cents + zone.price_cents;

	for item in select * from jsonb_array_elements(coalesce(p_add_ons, '[]')) loop
		select * into addon from add_ons where id = (item ->> 'id')::uuid and (active or p_by_admin);
		if not found then
			raise exception 'invalid_add_on';
		end if;

		v_qty := coalesce((item ->> 'quantity')::int, 1);
		if v_qty < 1 or v_qty > addon.max_quantity then
			raise exception 'invalid_add_on';
		end if;

		v_items := v_items || jsonb_build_object('label', addon.name, 'quantity', v_qty, 'unit_cents', addon.price_cents, 'total_cents', addon.price_cents * v_qty);
		v_total := v_total + addon.price_cents * v_qty;
	end loop;

	insert into rentals (
		status, package_id, package_name, nights, delivery_date, delivery_time, pickup_date, pickup_time,
		delivery_zone_id, delivery_zone_name, address, customer_name, customer_email, customer_phone, customer_notes,
		line_items, total_cents, source
	) values (
		case when p_by_admin or s.auto_confirm then 'confirmed' else 'pending' end::booking_status,
		pkg.id, pkg.name, pkg.nights, p_delivery_date, p_delivery_time, v_pickup, s.pickup_time,
		zone.id, zone.name, p_address, p_name, p_email, p_phone, coalesce(p_notes, ''),
		v_items, v_total, case when p_by_admin then 'admin' else 'website' end
	) returning * into v_rental;

	insert into rental_add_ons (rental_id, add_on_id, name, price_cents, quantity)
	select v_rental.id, a.id, a.name, a.price_cents, coalesce((e ->> 'quantity')::int, 1)
	from jsonb_array_elements(coalesce(p_add_ons, '[]')) e
	join add_ons a on a.id = (e ->> 'id')::uuid;

	return v_rental;
end;
$$;

create or replace function create_drop_in_booking(
	p_day_id uuid,
	p_slot drop_in_slot,
	p_party_size int,
	p_name text,
	p_email text,
	p_phone text,
	p_notes text default '',
	p_by_admin boolean default false
) returns drop_in_bookings
language plpgsql set search_path = public as $$
declare
	s settings;
	day drop_in_days;
	v_taken int;
	v_slot_start time := case p_slot when '17-19' then '17:00'::time else '19:00'::time end;
	v_booking drop_in_bookings;
begin
	perform pg_advisory_xact_lock(hashtext('ophir_sauna_calendar'));

	select * into s from settings;

	select * into day from drop_in_days where id = p_day_id and active;
	if not found then
		raise exception 'invalid_drop_in_day';
	end if;

	if not p_by_admin then
		-- Same-day drop-ins are fine until the slot starts.
		if day.date < local_today()
			or (day.date = local_today() and (now() at time zone 'America/Vancouver')::time >= v_slot_start) then
			raise exception 'too_soon';
		end if;

		if exists (select 1 from time_off t where day.date between t.start_date and t.end_date) then
			raise exception 'time_off';
		end if;
	end if;

	if p_party_size < 1 then
		raise exception 'invalid_party_size';
	end if;

	select coalesce(sum(party_size), 0) into v_taken
	from drop_in_bookings
	where drop_in_day_id = p_day_id and slot = p_slot and status in ('pending', 'confirmed');

	if v_taken + p_party_size > s.drop_in_capacity then
		raise exception 'slot_full';
	end if;

	insert into drop_in_bookings (
		drop_in_day_id, slot, party_size, status, customer_name, customer_email, customer_phone, customer_notes,
		price_cents, total_cents, source
	) values (
		p_day_id, p_slot, p_party_size,
		case when p_by_admin or s.auto_confirm then 'confirmed' else 'pending' end::booking_status,
		p_name, p_email, p_phone, coalesce(p_notes, ''),
		s.drop_in_price_cents, s.drop_in_price_cents * p_party_size,
		case when p_by_admin then 'admin' else 'website' end
	) returning * into v_booking;

	return v_booking;
end;
$$;

-- Only the server (secret key / service_role) may call these.
revoke all on function local_today() from public, anon, authenticated;
revoke all on function rental_conflict(date, date, uuid) from public, anon, authenticated;
revoke all on function drop_in_day_conflict(date) from public, anon, authenticated;
revoke all on function create_rental(uuid, date, time, uuid, text, jsonb, text, text, text, text, boolean) from public, anon, authenticated;
revoke all on function create_drop_in_booking(uuid, drop_in_slot, int, text, text, text, text, boolean) from public, anon, authenticated;
grant execute on function local_today() to service_role;
grant execute on function rental_conflict(date, date, uuid) to service_role;
grant execute on function drop_in_day_conflict(date) to service_role;
grant execute on function create_rental(uuid, date, time, uuid, text, jsonb, text, text, text, text, boolean) to service_role;
grant execute on function create_drop_in_booking(uuid, drop_in_slot, int, text, text, text, text, boolean) to service_role;
