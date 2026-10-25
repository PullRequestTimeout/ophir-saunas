import { error } from "@sveltejs/kit";
import { db } from "$lib/server/supabase";
import { localToday } from "$lib/utils/format";
import { dropInSlotLabels, type BookingStatus, type DropInBooking, type Rental } from "$lib/types/booking";
import { views, type BookingRow, type View } from "./views";
import type { PageServerLoad } from "./$types";

const LIMIT = 100;

export const load: PageServerLoad = async ({ url }) => {
	const requested = url.searchParams.get("view") ?? "";
	const view: View = requested in views ? (requested as View) : "upcoming";
	const type = url.searchParams.get("type");
	const showRentals = type !== "drop-in";
	const showDropIns = type !== "rental";
	// Strip characters that have meaning in PostgREST filters
	const search = (url.searchParams.get("q") ?? "").replace(/[,()%*\\]/g, " ").trim();
	const today = localToday();

	const statuses: BookingStatus[] =
		view === "requests" ? ["pending"] : view === "cancelled" ? ["declined", "cancelled"] : view === "past" ? ["confirmed"] : ["pending", "confirmed"];
	const ascending = view === "upcoming" || view === "requests";
	const matches = search ? `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%` : null;

	const rentalsQuery = async () => {
		let query = db()
			.from("rentals")
			.select("id, status, package_name, nights, delivery_date, pickup_date, customer_name, total_cents")
			.in("status", statuses);
		// A rental stays "upcoming" until it's picked up
		if (view === "upcoming") query = query.gte("pickup_date", today);
		if (view === "past") query = query.lt("pickup_date", today);
		if (matches) query = query.or(matches);
		const { data, error: dbError } = await query.order("delivery_date", { ascending }).limit(LIMIT).returns<Rental[]>();
		if (dbError) throw dbError;
		return data.map(
			(r): BookingRow => ({
				type: "rental",
				id: r.id,
				date: r.delivery_date,
				endDate: r.pickup_date,
				customer: r.customer_name,
				summary: r.package_name,
				status: r.status,
				total_cents: r.total_cents
			})
		);
	};

	const dropInsQuery = async () => {
		let query = db()
			.from("drop_in_bookings")
			.select("id, status, slot, party_size, customer_name, total_cents, drop_in_days!inner(date)")
			.in("status", statuses);
		if (view === "upcoming") query = query.gte("drop_in_days.date", today);
		if (view === "past") query = query.lt("drop_in_days.date", today);
		if (matches) query = query.or(matches);
		const { data, error: dbError } = await query
			.order("created_at", { ascending: false })
			.limit(LIMIT)
			.returns<(DropInBooking & { drop_in_days: { date: string } })[]>();
		if (dbError) throw dbError;
		return data.map(
			(b): BookingRow => ({
				type: "drop-in",
				id: b.id,
				date: b.drop_in_days.date,
				endDate: null,
				customer: b.customer_name,
				summary: `Drop-in, ${dropInSlotLabels[b.slot]} · ${b.party_size} ${b.party_size === 1 ? "person" : "people"}`,
				status: b.status,
				total_cents: b.total_cents
			})
		);
	};

	try {
		const [rentals, dropIns] = await Promise.all([showRentals ? rentalsQuery() : [], showDropIns ? dropInsQuery() : []]);
		const rows = [...rentals, ...dropIns].sort((a, b) => (ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
		return { rows, view, type: showRentals && showDropIns ? "all" : showRentals ? "rental" : "drop-in", search, limited: rows.length >= LIMIT };
	} catch (err) {
		console.error("Loading bookings failed", err);
		error(500, "Couldn't load bookings.");
	}
};
