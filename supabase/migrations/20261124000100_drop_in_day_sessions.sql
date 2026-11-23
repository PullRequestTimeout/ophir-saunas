-- Each drop-in day runs only the sessions the owner ticks. Run after 20261124000000_drop_in_slot_values.sql.

alter table drop_in_days
	add column if not exists sessions drop_in_slot[] not null default '{17-19,19-21}' check (cardinality(sessions) > 0);

-- '13-15' → 13:00
create or replace function drop_in_slot_start(p_slot drop_in_slot) returns time
language sql immutable set search_path = public as $$
	select (split_part(p_slot::text, '-', 1) || ':00')::time;
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
	v_slot_start time;
	v_booking drop_in_bookings;
begin
	perform pg_advisory_xact_lock(hashtext('ophir_sauna_calendar'));

	v_slot_start := drop_in_slot_start(p_slot);

	select * into s from settings;

	select * into day from drop_in_days where id = p_day_id and active;
	if not found then
		raise exception 'invalid_drop_in_day';
	end if;

	if not (p_slot = any(day.sessions)) then
		raise exception 'slot_unavailable';
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

-- save_drop_in_day gains the day's sessions. Removing a session that people have booked is refused under the
-- calendar lock, so a booking can't slip in between the check and the save.
drop function if exists save_drop_in_day(uuid, date, text, text, boolean);

create or replace function save_drop_in_day(
	p_id uuid,
	p_date date,
	p_location text,
	p_notes text,
	p_active boolean,
	p_sessions drop_in_slot[]
) returns drop_in_days
language plpgsql set search_path = public as $$
declare
	v_conflict text;
	v_day drop_in_days;
begin
	perform pg_advisory_xact_lock(hashtext('ophir_sauna_calendar'));

	if p_active then
		v_conflict := drop_in_day_conflict(p_date);
		if v_conflict is not null then
			raise exception '%', v_conflict;
		end if;
	end if;

	if p_id is not null and exists (
		select 1 from drop_in_bookings b
		where b.drop_in_day_id = p_id and b.status in ('pending', 'confirmed') and b.slot <> all(p_sessions)
	) then
		raise exception 'session_has_bookings';
	end if;

	if p_id is null then
		insert into drop_in_days (date, location, notes, active, sessions)
		values (p_date, p_location, coalesce(p_notes, ''), p_active, p_sessions)
		returning * into v_day;
	else
		update drop_in_days
		set date = p_date, location = p_location, notes = coalesce(p_notes, ''), active = p_active, sessions = p_sessions
		where id = p_id
		returning * into v_day;
	end if;

	return v_day;
end;
$$;

revoke all on function drop_in_slot_start(drop_in_slot) from public, anon, authenticated;
revoke all on function save_drop_in_day(uuid, date, text, text, boolean, drop_in_slot[]) from public, anon, authenticated;
grant execute on function drop_in_slot_start(drop_in_slot) to service_role;
grant execute on function save_drop_in_day(uuid, date, text, text, boolean, drop_in_slot[]) to service_role;
