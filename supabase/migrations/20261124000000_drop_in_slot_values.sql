-- Earlier drop-in sessions (1–3pm and 3–5pm) for busy days. Run this file on its own, before
-- 20261124000100_drop_in_day_sessions.sql: new enum values can't be used in the transaction that adds them.
-- Placed before '17-19' so the enum's order is time order.

alter type drop_in_slot add value if not exists '13-15' before '17-19';
alter type drop_in_slot add value if not exists '15-17' before '17-19';
