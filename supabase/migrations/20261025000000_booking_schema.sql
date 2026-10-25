-- Booking service schema: pricing, settings, rentals, drop-ins and time off.
-- All dates are local calendar days in America/Vancouver. Weekdays use ISO numbering (1 = Monday … 7 = Sunday).

create extension if not exists pgcrypto;

create type booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled');
create type drop_in_slot as enum ('17-19', '19-21');

-- Pricing ------------------------------------------------------------------

create table packages (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	nights int not null check (nights between 1 and 14),
	price_cents int not null check (price_cents >= 0),
	allowed_delivery_weekdays int[] not null check (allowed_delivery_weekdays <@ array[1, 2, 3, 4, 5, 6, 7]),
	description text not null default '',
	sort_order int not null default 0,
	active boolean not null default true,
	created_at timestamptz not null default now()
);

create table add_ons (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	price_cents int not null check (price_cents >= 0),
	max_quantity int not null default 1 check (max_quantity >= 1),
	description text not null default '',
	sort_order int not null default 0,
	active boolean not null default true,
	created_at timestamptz not null default now()
);

create table delivery_zones (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	price_cents int not null check (price_cents >= 0),
	sort_order int not null default 0,
	active boolean not null default true,
	created_at timestamptz not null default now()
);

-- Settings (single row) ----------------------------------------------------

create table settings (
	id boolean primary key default true check (id),
	auto_confirm boolean not null default false,
	same_day_turnaround boolean not null default true,
	pickup_time time not null default '10:00',
	delivery_window_start time not null default '18:00',
	delivery_window_end time not null default '21:00',
	delivery_slot_minutes int not null default 30 check (delivery_slot_minutes between 5 and 180),
	drop_in_price_cents int not null default 2500 check (drop_in_price_cents >= 0),
	drop_in_capacity int not null default 6 check (drop_in_capacity between 1 and 20),
	owner_email text not null default 'info@ophirsaunas.ca',
	reminder_days_before int not null default 2 check (reminder_days_before between 0 and 14),
	check (delivery_window_start < delivery_window_end)
);

insert into settings default values;

-- Bookings -----------------------------------------------------------------

create table rentals (
	id uuid primary key default gen_random_uuid(),
	status booking_status not null,
	package_id uuid references packages (id) on delete set null,
	package_name text not null,
	nights int not null,
	delivery_date date not null,
	delivery_time time not null,
	pickup_date date not null,
	pickup_time time not null,
	delivery_zone_id uuid references delivery_zones (id) on delete set null,
	delivery_zone_name text not null,
	address text not null,
	customer_name text not null,
	customer_email text not null,
	customer_phone text not null,
	customer_notes text not null default '',
	admin_notes text not null default '',
	line_items jsonb not null default '[]',
	total_cents int not null,
	source text not null default 'website' check (source in ('website', 'admin')),
	manage_token uuid not null default gen_random_uuid(),
	reminder_sent_at timestamptz,
	created_at timestamptz not null default now(),
	check (pickup_date > delivery_date)
);

create index rentals_dates_idx on rentals (delivery_date, pickup_date);

create table rental_add_ons (
	id uuid primary key default gen_random_uuid(),
	rental_id uuid not null references rentals (id) on delete cascade,
	add_on_id uuid references add_ons (id) on delete set null,
	name text not null,
	price_cents int not null,
	quantity int not null check (quantity >= 1)
);

create table drop_in_days (
	id uuid primary key default gen_random_uuid(),
	date date not null unique,
	location text not null,
	notes text not null default '',
	active boolean not null default true,
	created_at timestamptz not null default now()
);

create table drop_in_bookings (
	id uuid primary key default gen_random_uuid(),
	drop_in_day_id uuid not null references drop_in_days (id) on delete restrict,
	slot drop_in_slot not null,
	party_size int not null check (party_size >= 1),
	status booking_status not null,
	customer_name text not null,
	customer_email text not null,
	customer_phone text not null,
	customer_notes text not null default '',
	admin_notes text not null default '',
	price_cents int not null,
	total_cents int not null,
	source text not null default 'website' check (source in ('website', 'admin')),
	manage_token uuid not null default gen_random_uuid(),
	reminder_sent_at timestamptz,
	created_at timestamptz not null default now()
);

create index drop_in_bookings_day_idx on drop_in_bookings (drop_in_day_id, slot);

create table time_off (
	id uuid primary key default gen_random_uuid(),
	start_date date not null,
	end_date date not null,
	banner_message text not null default '',
	show_banner boolean not null default true,
	created_at timestamptz not null default now(),
	check (end_date >= start_date)
);

-- Lock everything down: the site only reaches these tables through server code using the secret key.

alter table packages enable row level security;
alter table add_ons enable row level security;
alter table delivery_zones enable row level security;
alter table settings enable row level security;
alter table rentals enable row level security;
alter table rental_add_ons enable row level security;
alter table drop_in_days enable row level security;
alter table drop_in_bookings enable row level security;
alter table time_off enable row level security;

-- Seed pricing from the current pricing page ------------------------------

insert into packages (name, nights, price_cents, allowed_delivery_weekdays, description, sort_order) values
	('1 Night Mid-Week Rental', 1, 30000, array[1, 2, 3, 4], 'Delivery Monday through Thursday.', 1),
	('2 Night Mid-Week Rental', 2, 35000, array[1, 2, 3], 'Delivery Monday through Wednesday.', 2),
	('3 Night Weekend Rental', 3, 45000, array[5], 'Friday delivery, Monday pickup.', 3),
	('4 Night Weekday Rental', 4, 45000, array[1], 'Monday delivery, Friday pickup. 4 for the cost of 3!', 4);

insert into add_ons (name, price_cents, max_quantity, sort_order) values
	('3 Hour Burn Wood Bundle', 4000, 4, 1),
	('6 Hour Burn Wood Bundle', 8000, 4, 2),
	('9 Hour Burn Wood Bundle', 12000, 4, 3),
	('Cold Plunge Pool Rental', 5000, 1, 4);

insert into delivery_zones (name, price_cents, sort_order) values
	('Rossland', 2500, 1),
	('Warfield', 3000, 2),
	('Trail', 3500, 3),
	('Montrose, Fruitvale, & Genelle', 4000, 4),
	('Castlegar & Robson', 6000, 5),
	('Nelson & Christina Lake', 10000, 6);
