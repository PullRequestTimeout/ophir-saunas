// Content for the admin Help page. Plain text only (no HTML), so the page can highlight search matches safely.
// Keep it in step with the app: when booking rules, emails, admin pages or the booking modal change, update the matching article.

export type Block =
	| { type: "p"; text: string }
	| { type: "list"; items: string[]; ordered?: boolean }
	/** A callout for things that are easy to get wrong */
	| { type: "note"; text: string };

export interface Article {
	/** Unique across all sections; used as the anchor, e.g. /admin/help#same-day-turnaround */
	id: string;
	title: string;
	blocks: Block[];
	link?: { href: string; label: string };
}

export interface Section {
	id: string;
	title: string;
	icon: string;
	articles: Article[];
}

export const sections: Section[] = [
	{
		id: "getting-started",
		title: "Getting started",
		icon: "rocket_launch",
		articles: [
			{
				id: "signing-in",
				title: "Signing in and out",
				blocks: [
					{
						type: "p",
						text: "Sign in at ophirsaunas.ca/admin with your email and password. Only email addresses on the admin list can get in; anyone else sees “This account doesn't have admin access.” and is signed out again."
					},
					{
						type: "p",
						text: "If you open a dashboard link while signed out, you're sent to the sign-in page and then straight back to that page. Use “Sign out” at the bottom of the menu when you're on a shared computer."
					},
					{
						type: "note",
						text: "Forgotten your password or need another person added as an admin? Ask your web developer; this can't be changed from the dashboard."
					}
				]
			},
			{
				id: "dashboard-tour",
				title: "What each page is for",
				blocks: [
					{
						type: "list",
						items: [
							"Overview: requests waiting for you, everything happening in the next two weeks, and upcoming time off.",
							"Bookings: every rental and drop-in booking, with search. Open one to approve, decline, cancel or add notes. “New booking” adds a phone booking.",
							"Drop-ins: the days you run drop-in sessions, and who's booked on each.",
							"Time Off: dates you're away, which can't be booked, and the homepage banner.",
							"Pricing: rental packages, add-ons, delivery areas and the drop-in price.",
							"Help: this page.",
							"Settings: auto-confirm, same-day turnaround, where notifications go, reminders, delivery times and drop-in capacity."
						]
					},
					{
						type: "p",
						text: "“View site” in the menu opens the public website. The email previews page is linked from Settings (“Preview the booking emails”)."
					}
				]
			}
		]
	},
	{
		id: "bookings",
		title: "Bookings",
		icon: "event",
		articles: [
			{
				id: "booking-statuses",
				title: "Booking statuses",
				blocks: [
					{
						type: "list",
						items: [
							"Pending: a request from the website waiting for you to approve or decline it. Its dates are already held, so nobody else can book them.",
							"Confirmed: the booking is on. Only confirmed bookings get reminder emails.",
							"Declined: you turned down a request. Its dates are free again.",
							"Cancelled: a pending or confirmed booking you cancelled. Its dates are free again."
						]
					},
					{
						type: "p",
						text: "Bookings you add yourself with “New booking” also carry an “Added by admin” badge. They're always confirmed straight away."
					},
					{
						type: "note",
						text: "Declined and cancelled are final: there's no button to reopen a booking. If you cancelled by mistake, add it again with “New booking”."
					}
				]
			},
			{
				id: "overview-page",
				title: "The Overview page",
				link: { href: "/admin", label: "Open Overview" },
				blocks: [
					{
						type: "list",
						items: [
							"“Requests to review” lists every pending rental and drop-in, soonest first. Click a name to open it.",
							"“Next two weeks” shows each day from today: time off, a sauna that's currently out with a customer, pickups, drop-in days (with how many are booked in each session) and drop-offs. Pending items have a “Pending” badge.",
							"“Time off” lists current and upcoming time off, and whether its homepage banner is on."
						]
					},
					{
						type: "p",
						text: "The “New booking” button at the top is the quickest way to add a phone booking."
					}
				]
			},
			{
				id: "bookings-list",
				title: "Finding a booking",
				link: { href: "/admin/bookings", label: "Open Bookings" },
				blocks: [
					{ type: "p", text: "The Bookings page has four tabs:" },
					{
						type: "list",
						items: [
							"Upcoming: pending and confirmed bookings that haven't finished yet, soonest first. A rental stays here until its pickup day has passed.",
							"Requests: every pending request, whatever its date.",
							"Past: confirmed bookings that have finished, newest first.",
							"Declined & cancelled: everything you've declined or cancelled."
						]
					},
					{
						type: "p",
						text: "Use “Type” to show only rentals or only drop-ins, and “Search” to find a customer by part of their name, email or phone number, then press “Apply”. Each type shows at most 100 bookings; if you hit that, search to narrow the list."
					},
					{
						type: "note",
						text: "A request you never answered stays under Requests even after its date has passed; it won't move to Past. Decline or cancel old requests to tidy them up."
					}
				]
			},
			{
				id: "booking-details",
				title: "A booking's page",
				blocks: [
					{
						type: "p",
						text: "Click a customer's name anywhere in the dashboard to open their booking. A rental shows the drop-off and pickup times, package, delivery area, address (with an “Open in Google Maps” link) and a price breakdown. A drop-in shows the date, session, location, number of people and total."
					},
					{
						type: "p",
						text: "The Customer card has their name, phone (tap to call), email (tap to email) and any notes they left when booking. The bottom line shows when it was booked and a short reference number."
					}
				]
			},
			{
				id: "approve-decline-cancel",
				title: "Approving, declining and cancelling",
				blocks: [
					{ type: "p", text: "The Actions card on a booking's page shows the buttons that apply to it:" },
					{
						type: "list",
						items: [
							"“Approve” (pending requests): confirms the booking.",
							"“Decline” (pending requests): turns the request down and frees its dates.",
							"“Cancel booking” (pending or confirmed): cancels it and frees its dates."
						]
					},
					{
						type: "p",
						text: "“Email the customer about this change” is ticked by default. Leave it ticked to send the customer the confirmed, declined or cancelled email; untick it if you've already spoken to them. It only appears when the customer gave an email address."
					},
					{
						type: "p",
						text: "A message at the top tells you what happened, e.g. “Booking approved. The customer has been emailed.” If the email couldn't be sent, a warning stays on screen until you close it; the change itself has still been made."
					},
					{
						type: "note",
						text: "If you see “This booking has already changed. Reload the page to see its current status.”, the booking was changed in another tab or by someone else. Reload and check before trying again."
					}
				]
			},
			{
				id: "resend-email",
				title: "Resending an email",
				blocks: [
					{
						type: "p",
						text: "“Resend … email” in the Actions card sends the customer the email for the booking's current status again (request received, confirmed, declined or cancelled). Use it when a customer says they never got it; ask them to check their junk folder first."
					}
				]
			},
			{
				id: "admin-notes",
				title: "Admin notes",
				blocks: [
					{
						type: "p",
						text: "Every booking has an “Admin notes” box for things like payment received or gate codes. Only you see these notes; they're never shown or emailed to the customer. Press “Save notes” after typing."
					}
				]
			},
			{
				id: "change-booking",
				title: "Changing a booking's dates or details",
				blocks: [
					{
						type: "p",
						text: "Bookings can't be edited once made (only their admin notes). To move a booking or change its package, add-ons or party size:"
					},
					{
						type: "list",
						ordered: true,
						items: [
							"Open the booking and press “Cancel booking”. Untick “Email the customer about this change” if you don't want them to get the cancellation email.",
							"Add the new version with “New booking”, ticking “Email the customer a confirmation” if you'd like them to get the updated details.",
							"Optionally note the change in the new booking's admin notes."
						]
					},
					{
						type: "note",
						text: "Cancel first: the old booking holds its dates until it's cancelled, so a new booking on overlapping dates would be refused."
					}
				]
			}
		]
	},
	{
		id: "manual-bookings",
		title: "Adding bookings yourself",
		icon: "edit_calendar",
		articles: [
			{
				id: "new-booking",
				title: "Adding a phone or moved booking",
				link: { href: "/admin/bookings/new", label: "Open New booking" },
				blocks: [
					{
						type: "p",
						text: "Use “New booking” (on the Overview and Bookings pages) for bookings taken by phone or in person, and for ones moved over from YouCanBookMe. Choose the “Private rental” or “Drop-in” tab, fill in the booking and the customer's details, then press “Create rental” or “Create drop-in booking”."
					},
					{
						type: "p",
						text: "Only the customer's name is required; email and phone are optional. “Admin notes” are just for you, e.g. “Paid by e-transfer” or “Moved from YCBM”."
					},
					{
						type: "p",
						text: "These bookings are confirmed straight away and marked “Added by admin”. You won't get a notification email for them. The customer gets an email only if you tick “Email the customer a confirmation” (which needs their email address)."
					}
				]
			},
			{
				id: "manual-booking-rules",
				title: "Which rules apply to bookings you add",
				blocks: [
					{ type: "p", text: "You can do some things the website doesn't let customers do:" },
					{
						type: "list",
						items: [
							"Book today or a past date (handy for recording bookings moved from YouCanBookMe).",
							"Pick any drop-off time, even outside the delivery window.",
							"Use packages, add-ons and delivery areas you've hidden; they're marked “(hidden)”.",
							"Book a drop-off on a day the package doesn't normally drop off, by ticking “Ignore the package's drop-off days (for one-off deals and moved bookings)”.",
							"Book a drop-in session that has already started."
						]
					},
					{ type: "p", text: "Some rules still apply, so nothing double-books:" },
					{
						type: "list",
						items: [
							"A rental can't overlap another rental, an open drop-in day or your time off.",
							"A drop-in booking can't go over the session's capacity, and the day must be open for bookings."
						]
					},
					{
						type: "note",
						text: "Drop-in bookings you add yourself aren't blocked by time off, so double-check the date if you're away around then."
					}
				]
			},
			{
				id: "manual-booking-errors",
				title: "When a booking you're adding is refused",
				blocks: [
					{
						type: "list",
						items: [
							"“The sauna is already booked for some of those dates.” Another rental overlaps. Check Upcoming bookings, or cancel the old booking first if you're moving it.",
							"“A drop-in day falls within those dates. Move or hide the drop-in day first.” Change the drop-in day on the Drop-ins page, or pick other dates.",
							"“Those dates fall within your time off.” Shorten or delete the time off first.",
							"“There aren't enough spots left in that session.” The session is full; reduce the number of people, choose the other session, or raise the capacity in Settings.",
							"“This package drops off … Choose another date, or tick “Ignore the package's drop-off days”.” Tick that box if the exception is intended."
						]
					},
					{
						type: "p",
						text: "“There are no upcoming drop-in days.” on the Drop-in tab means you need to add a drop-in day before you can book people onto it."
					}
				]
			}
		]
	},
	{
		id: "calendar",
		title: "Calendar and availability",
		icon: "calendar_month",
		articles: [
			{
				id: "why-unavailable",
				title: "Why a date is greyed out for customers",
				blocks: [
					{ type: "p", text: "On the website, a rental drop-off date can only be picked when all of these are true:" },
					{
						type: "list",
						items: [
							"It's tomorrow or later. Customers can't book a drop-off for today online.",
							"It's one of the package's delivery days (shown as “Drop-off Mon–Thu” or similar on each package).",
							"Every day from drop-off to pickup is free of other rentals, open drop-in days and your time off (see the same-day turnaround article for the edges)."
						]
					},
					{
						type: "p",
						text: "Pickup is always the drop-off date plus the package's number of nights. Pending requests hold their dates just like confirmed bookings, so a request you haven't answered yet still blocks other customers."
					},
					{
						type: "note",
						text: "If a customer says nothing is available, check for pending requests you haven't declined, time off, and drop-in days in that period, and the package's delivery days on the Pricing page."
					}
				]
			},
			{
				id: "same-day-turnaround",
				title: "Same-day turnaround",
				link: { href: "/admin/settings", label: "Open Settings" },
				blocks: [
					{
						type: "p",
						text: "“Allow same-day turnaround” in Settings decides whether a pickup and another delivery can happen on the same day. Pickups are in the morning and deliveries in the evening, so with it on you can collect the sauna in the morning and deliver it to the next customer that evening."
					},
					{
						type: "list",
						items: [
							"On: a new rental can drop off on another rental's pickup day. A drop-in day can also fall on a rental's pickup day.",
							"Off: there must be at least one free day between rentals, and a drop-in day can't fall on any day from drop-off to pickup."
						]
					},
					{
						type: "p",
						text: "Example: a rental drops off Friday and is picked up Sunday. With turnaround on, the next rental can drop off on Sunday. With it off, the earliest is Monday."
					},
					{
						type: "note",
						text: "Changing this setting only affects new bookings; existing bookings aren't moved or cancelled."
					}
				]
			},
			{
				id: "rentals-and-drop-ins",
				title: "Rentals and drop-in days",
				blocks: [
					{
						type: "p",
						text: "The sauna can't be out with a rental customer and running drop-in sessions on the same day, so open drop-in days block rentals and rentals block new drop-in days. The only overlap allowed is a drop-in day on a rental's pickup day, and only when same-day turnaround is on."
					},
					{
						type: "p",
						text: "Drop-in days you've hidden (“Open for bookings” unticked) don't block rentals."
					}
				]
			},
			{
				id: "time-off-blocking",
				title: "How time off affects bookings",
				blocks: [
					{
						type: "p",
						text: "Customers can't book a rental that touches any day of your time off (including its pickup day), and can't book drop-in sessions on those days. You also can't open a drop-in day on a time-off date."
					},
					{
						type: "note",
						text: "Adding time off never cancels bookings that are already in those dates. See “Adding time off”."
					}
				]
			}
		]
	},
	{
		id: "drop-ins",
		title: "Drop-in days",
		icon: "groups",
		articles: [
			{
				id: "add-drop-in-day",
				title: "Adding a drop-in day",
				link: { href: "/admin/drop-ins", label: "Open Drop-ins" },
				blocks: [
					{
						type: "p",
						text: "On the Drop-ins page, open “Add a drop-in day” and fill in:"
					},
					{
						type: "list",
						items: [
							"Date: today or later. You can only have one drop-in day per date.",
							"Location: where the sauna will be. Customers see it when booking and in their emails.",
							"Notes for customers (optional): e.g. parking or what to bring. Shown when booking and in drop-in emails.",
							"Open for bookings: ticked means customers can book it."
						]
					},
					{
						type: "p",
						text: "A day can't be added over a rental (pending or confirmed) or your time off; you'll see a message explaining which."
					}
				]
			},
			{
				id: "drop-in-sessions",
				title: "Sessions, capacity and price",
				blocks: [
					{
						type: "p",
						text: "Every drop-in day has two sessions, 5:00pm – 7:00pm and 7:00pm – 9:00pm. Each holds up to the “Maximum people per time slot” set in Settings. The price per person is on the Pricing page."
					},
					{
						type: "p",
						text: "Each day on the Drop-ins page shows how many people are booked in each session (pending and confirmed) and lists every booking with phone and email links."
					},
					{
						type: "p",
						text: "Customers can book a session online until it starts, including on the day itself. A full session shows as “Full” on the website."
					},
					{
						type: "note",
						text: "Lowering the capacity never removes people already booked; it just stops new bookings until there's room."
					}
				]
			},
			{
				id: "edit-drop-in-day",
				title: "Moving, hiding or deleting a drop-in day",
				blocks: [
					{
						type: "list",
						items: [
							"You can change the location and notes any time with “Edit day”.",
							"You can't change the date or untick “Open for bookings” while people are booked (pending or confirmed). Cancel their bookings first, after letting them know.",
							"A hidden day doesn't show on the website, doesn't block rentals and can't take new bookings, even ones you add yourself.",
							"A day can only be deleted if it has never had any bookings, including declined or cancelled ones. Otherwise untick “Open for bookings” to hide it instead."
						]
					}
				]
			}
		]
	},
	{
		id: "time-off",
		title: "Time off",
		icon: "beach_access",
		articles: [
			{
				id: "add-time-off",
				title: "Adding time off",
				link: { href: "/admin/time-off", label: "Open Time Off" },
				blocks: [
					{
						type: "p",
						text: "On the Time Off page, fill in the “First day off” and “Last day off” and press “Add time off”. Those dates can't be booked online for rentals or drop-ins."
					},
					{
						type: "p",
						text: "If bookings already fall in those dates, a “Some bookings fall in this time off” card lists them after you save. They haven't been cancelled: contact those customers, or change your dates."
					},
					{
						type: "p",
						text: "Deleting time off opens those dates up for bookings again."
					}
				]
			},
			{
				id: "homepage-banner",
				title: "The homepage banner",
				blocks: [
					{
						type: "p",
						text: "With “Show a banner on the homepage” ticked, a banner tells visitors you're away. It appears from 30 days before your first day off until your last day off. If you leave the message blank it reads “We're taking a break [dates]. Bookings resume [date].”, where bookings resume the day after your last day off."
					},
					{
						type: "list",
						items: [
							"Only one banner shows at a time: the earliest time off that's within 30 days.",
							"Changes can take about a minute to appear on the homepage.",
							"The banner sits above the menu at the top of the homepage and stays there as visitors scroll. They can close it with the ✕; it comes back next time they visit."
						]
					}
				]
			}
		]
	},
	{
		id: "pricing",
		title: "Pricing",
		icon: "sell",
		articles: [
			{
				id: "packages",
				title: "Rental packages",
				link: { href: "/admin/pricing", label: "Open Pricing" },
				blocks: [
					{ type: "p", text: "Each package has:" },
					{
						type: "list",
						items: [
							"Name and Price.",
							"Nights (1 to 14): pickup is this many nights after drop-off.",
							"Delivery days: the weekdays it can be dropped off. Customers can only pick these days.",
							"Description: shown on the pricing page and in the booking form.",
							"Display order: lower numbers show first."
						]
					}
				]
			},
			{
				id: "add-ons",
				title: "Add-ons and pick-one groups",
				blocks: [
					{
						type: "p",
						text: "“Max quantity” is how many of an add-on a customer can choose. With 1 it's a simple tick box; above 1 they get − and + buttons."
					},
					{
						type: "p",
						text: "Give several add-ons the same “Group (optional)” name, e.g. “Firewood”, to make them a pick-one choice: customers choose one of them (or none) instead of adding several. Max quantity is ignored in a group. The group shows where its first add-on would be in the display order."
					}
				]
			},
			{
				id: "delivery-areas",
				title: "Delivery areas",
				blocks: [
					{
						type: "p",
						text: "Customers choose their delivery area when booking a rental, and its price is added to the total. Use “Display order” to set the order they appear in."
					}
				]
			},
			{
				id: "drop-in-price",
				title: "Drop-in price",
				blocks: [
					{
						type: "p",
						text: "Set the drop-in “Price per person ($)” in the “Drop-in sessions” card at the bottom of the Pricing page and press “Save price”."
					}
				]
			},
			{
				id: "hide-or-delete",
				title: "Hiding vs deleting an item",
				blocks: [
					{
						type: "list",
						items: [
							"Untick “Available to book” to hide a package, add-on or area. It disappears from the website, but stays in your “New booking” form (marked “(hidden)”), and you can turn it back on any time.",
							"Delete removes it completely. Use it only for things you won't offer again."
						]
					},
					{
						type: "note",
						text: "Price changes apply to new bookings straight away. Existing bookings keep the names and prices they were booked at, even if you change or delete the item later."
					}
				]
			}
		]
	},
	{
		id: "settings",
		title: "Settings",
		icon: "settings",
		articles: [
			{
				id: "auto-confirm",
				title: "Confirm bookings automatically",
				link: { href: "/admin/settings", label: "Open Settings" },
				blocks: [
					{
						type: "list",
						items: [
							"On: website bookings are confirmed straight away. The customer gets the confirmed email, and your notification says it was confirmed automatically.",
							"Off: website bookings arrive as requests. The customer gets a “request received” email, the dates are held, and you approve or decline each one."
						]
					},
					{
						type: "p",
						text: "With it off, customers see “Send request” instead of “Confirm booking” on the last step."
					}
				]
			},
			{
				id: "notification-email",
				title: "Send booking notifications to",
				blocks: [
					{
						type: "p",
						text: "New website bookings and requests are emailed to this address. When a customer replies to one of their booking emails, the reply goes here too."
					},
					{
						type: "p",
						text: "When you reply to a notification email, your reply goes straight to the customer."
					},
					{
						type: "note",
						text: "The contact line at the bottom of customer emails always shows info@ophirsaunas.ca, whatever this is set to."
					}
				]
			},
			{
				id: "reminder-setting",
				title: "Reminder emails (days before)",
				blocks: [
					{
						type: "p",
						text: "How many days before the drop-off (or drop-in day) the reminder email goes out, from 0 (the day itself) to 14. See “Reminder emails” for the details."
					}
				]
			},
			{
				id: "delivery-settings",
				title: "Delivery and pickup times",
				blocks: [
					{
						type: "list",
						items: [
							"“Delivery window opens” and “Delivery window closes”: the drop-off times customers can choose from.",
							"“Delivery time options every”: the gap between the times on offer (15, 30 or 60 minutes), e.g. 6:00pm, 6:30pm, 7:00pm.",
							"“Expected pickup time”: shown to customers as “around” this time on their pickup day."
						]
					},
					{
						type: "p",
						text: "Existing rentals keep the pickup time they were booked with."
					}
				]
			},
			{
				id: "drop-in-capacity",
				title: "Maximum people per time slot",
				blocks: [
					{
						type: "p",
						text: "The drop-in capacity: how many people can book each drop-in session (1 to 20). It applies to both sessions on every drop-in day."
					}
				]
			}
		]
	},
	{
		id: "emails",
		title: "Emails",
		icon: "mail",
		articles: [
			{
				id: "which-emails",
				title: "Which emails are sent, and when",
				blocks: [
					{ type: "p", text: "Customers can get:" },
					{
						type: "list",
						items: [
							"Request received: when they book on the website and auto-confirm is off.",
							"Confirmed: when they book with auto-confirm on, when you approve their request, or when you add a booking with “Email the customer a confirmation” ticked.",
							"Declined: when you decline their request with the email box ticked.",
							"Cancelled: when you cancel their booking with the email box ticked.",
							"Reminder: a few days before their booking (see “Reminder emails”)."
						]
					},
					{
						type: "p",
						text: "You get a “New booking request” or “New booking” email for every website booking, with the customer's contact details and a button to open it in the dashboard. Bookings you add yourself don't send you an email."
					},
					{
						type: "p",
						text: "Request received, confirmed and reminder emails include the prices and total, say nothing has been charged, and include the cancellation policy from the website's FAQ. Every customer email invites them to reply with questions or changes."
					}
				]
			},
			{
				id: "reminders",
				title: "Reminder emails",
				blocks: [
					{
						type: "p",
						text: "Reminders are sent automatically once a day, at about 8 or 9am. A booking gets one when:"
					},
					{
						type: "list",
						items: [
							"it's confirmed (pending requests never get a reminder),",
							"the customer gave an email address,",
							"its drop-off date or drop-in day is within the “Reminder emails (days before)” setting, and",
							"it was made more than a day ago (they've only just had their confirmation otherwise)."
						]
					},
					{
						type: "p",
						text: "Each booking gets one reminder at most. If sending fails, it's tried again the next day. Rental reminders ask the customer to have a flat, clear spot ready and someone around at drop-off; drop-in reminders suggest bringing a towel, water and something warm."
					}
				]
			},
			{
				id: "email-failures",
				title: "When an email doesn't arrive",
				blocks: [
					{
						type: "p",
						text: "A failed email never stops a booking or one of your actions from going through. When an email you triggered fails, a warning stays on screen until you close it, and you can try again with “Resend … email” on the booking's page."
					},
					{
						type: "list",
						items: [
							"Ask the customer to check their junk or spam folder; the booking screen reminds them of this too.",
							"Check the email address on their booking for typos.",
							"If the dashboard says “Email isn't set up yet”, no emails are being sent at all; contact your web developer."
						]
					},
					{
						type: "note",
						text: "If a notification of a new website booking fails, nothing warns you, so check “Requests to review” on the Overview regularly."
					}
				]
			},
			{
				id: "email-previews",
				title: "Previewing the emails",
				link: { href: "/admin/emails", label: "Open email previews" },
				blocks: [
					{
						type: "p",
						text: "The email previews page (linked from Settings) shows every customer email and your notifications with a sample booking. Choose one from the “Email” list; tick “Show plain-text version” to see the text-only copy. Previews never send anything."
					}
				]
			}
		]
	},
	{
		id: "customers",
		title: "What customers see",
		icon: "storefront",
		articles: [
			{
				id: "customer-rental-flow",
				title: "Booking a private rental",
				blocks: [
					{
						type: "p",
						text: "Any “Book Now” button opens the booking window. After choosing “Private Rental”, customers go through these steps:"
					},
					{
						type: "list",
						ordered: true,
						items: [
							"Choose your package: each shows its price and drop-off days.",
							"Pick your drop-off date: only available dates are highlighted, up to 12 months ahead. Then they choose a drop-off time and see their pickup day and time.",
							"Where should we deliver?: their delivery area and street address.",
							"Add extras: optional add-ons (skipped when you have none).",
							"Your details: name, email, phone and optional notes.",
							"Review your booking: everything with “Edit” links, the estimated total and the cancellation policy."
						]
					}
				]
			},
			{
				id: "customer-drop-in-flow",
				title: "Booking a drop-in session",
				blocks: [
					{
						type: "list",
						ordered: true,
						items: [
							"Choose a drop-in day: days with spots left are highlighted. They see the location and your notes for that day.",
							"Choose your session: each shows how many spots are left, or “Full”. They choose how many people, up to the spots left, and see the total.",
							"Your details.",
							"Review your booking."
						]
					}
				]
			},
			{
				id: "customer-submit",
				title: "After they press the button",
				blocks: [
					{
						type: "p",
						text: "With auto-confirm on, the last button reads “Confirm booking” and they see “Booking confirmed”. With it off, it reads “Send request” and they see “Request received”, with a note that you'll confirm by email."
					},
					{
						type: "p",
						text: "Either way they're reminded to check their junk folder if the email doesn't arrive, and that nothing has been charged."
					}
				]
			},
			{
				id: "payment-cancellation",
				title: "Payment and cancellations",
				blocks: [
					{
						type: "p",
						text: "Nothing is charged online. The booking screens and emails all say you'll arrange payment with the customer directly."
					},
					{
						type: "p",
						text: "Customers can't cancel or change a booking themselves. They reply to their email or write to info@ophirsaunas.ca, and you cancel it (and add a new one if they're moving it)."
					},
					{
						type: "p",
						text: "The cancellation policy shown when booking and in emails comes from the cancellation question in the website's FAQ, so changing it there changes it everywhere."
					}
				]
			},
			{
				id: "double-booking",
				title: "When two people book at the same moment",
				blocks: [
					{
						type: "p",
						text: "The system re-checks availability as each booking is saved, so only one can get the dates. The other customer sees a message such as “Sorry, the sauna is already booked for some of those dates.” or “Sorry, there aren't enough spots left in that time slot.”, with a link to choose again. Everything else they entered is kept."
					}
				]
			},
			{
				id: "closing-booking-window",
				title: "Closing the booking window",
				blocks: [
					{
						type: "p",
						text: "If a customer closes the window after starting, they're asked “Leave your booking?” because what they've entered is cleared. There's no saving for later; the next time it opens it starts fresh."
					}
				]
			}
		]
	},
	{
		id: "troubleshooting",
		title: "Troubleshooting",
		icon: "build",
		articles: [
			{
				id: "no-dates-available",
				title: "A customer says no dates are available",
				blocks: [
					{
						type: "list",
						items: [
							"Look for pending requests holding those dates (Bookings → Requests) and decline any you won't take.",
							"Check Time Off and Drop-ins for that period.",
							"Check the package's delivery days on the Pricing page; customers can only drop off on those days.",
							"Make sure the package and delivery area are ticked “Available to book”.",
							"If you'd still like to take the booking, add it yourself with “New booking”."
						]
					}
				]
			},
			{
				id: "no-notification",
				title: "I didn't get an email about a new booking",
				blocks: [
					{
						type: "p",
						text: "Check your junk folder, and that “Send booking notifications to” in Settings is your address. The booking is saved either way, so it will be on the Overview and Bookings pages."
					}
				]
			},
			{
				id: "customer-no-email",
				title: "A customer didn't get their email",
				blocks: [
					{
						type: "p",
						text: "Ask them to check junk or spam, check their address on the booking, then use “Resend … email” on the booking's page."
					}
				]
			},
			{
				id: "cant-delete-drop-in",
				title: "I can't delete or move a drop-in day",
				blocks: [
					{
						type: "p",
						text: "Days with bookings can't be moved or hidden until those bookings are cancelled, and days that have ever had a booking can't be deleted. Untick “Open for bookings” to hide it instead."
					}
				]
			}
		]
	}
];
