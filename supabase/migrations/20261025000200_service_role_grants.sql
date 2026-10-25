-- Newer Supabase projects don't auto-grant table privileges to the API roles, so give the server (secret key /
-- service_role) access explicitly. anon and authenticated get nothing: the public site only goes through server code.

grant usage on schema public to service_role;

grant select, insert, update, delete on
	packages,
	add_ons,
	delivery_zones,
	settings,
	rentals,
	rental_add_ons,
	drop_in_days,
	drop_in_bookings,
	time_off
to service_role;

grant usage on type booking_status, drop_in_slot to service_role;
