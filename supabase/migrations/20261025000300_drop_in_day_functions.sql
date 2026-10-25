-- Creating or re-activating a drop-in day must take the same calendar lock as bookings, otherwise a rental could be
-- booked for that date at the same moment.

create or replace function save_drop_in_day(
	p_id uuid,
	p_date date,
	p_location text,
	p_notes text,
	p_active boolean
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

	if p_id is null then
		insert into drop_in_days (date, location, notes, active)
		values (p_date, p_location, coalesce(p_notes, ''), p_active)
		returning * into v_day;
	else
		update drop_in_days
		set date = p_date, location = p_location, notes = coalesce(p_notes, ''), active = p_active
		where id = p_id
		returning * into v_day;
	end if;

	return v_day;
end;
$$;

revoke all on function save_drop_in_day(uuid, date, text, text, boolean) from public, anon, authenticated;
grant execute on function save_drop_in_day(uuid, date, text, text, boolean) to service_role;
