# Phase 9 — Pilot Runbook (2 Tuesdays, 1 farm, 5–10 buyers)

## Sunday night (Admin)
1. Open /prices, set next Monday's Large / Medium / Pullet prices.
2. Freeze prices — no edits after Monday 00:00.

## Monday (Buyers)
1. Buyers open http://localhost:3000, pick size + crates (min 10) + address.
2. Wallet applies first, remainder held. Admin watches /admin holds total.
3. 18:00: send cutoff reminder (in-app notice and Termii SMS when configured).
4. 23:59: POST /api/cutoff (locks week, opens next).

## Tuesday morning (Admin)
1. Check /admin farm demand (crates per size). Pay farm.
2. Validate each order (FundsHeld → Validated), adjust shortages (→ Adjusted + wallet credit).
3. POST /api/routes, dispatch (→ Dispatched).

## Tuesday evening (Driver + Hubs)
1. Driver drops full crates, collects empties (+ photo via /api/photos when R2 keys set).
2. Confirm each delivery (→ Delivered, breakage → wallet).

## Tuesday night (Admin)
1. POST /api/settle → farm payout total. Check /api/metrics (95% / <2%).
2. Wallet credits roll to next Monday automatically.

## Rollback
- Wrong prices? POST /api/price-weeks again before Monday 00:00.
- Bad order? Cancel in DB (status='Cancelled') before cutoff; hold released at cutoff.
- App down? `docker compose up -d` restarts both boxes. Data lives in pgdata volume.
- Existing database? Apply `db/migrations/001_payment_notifications.sql` once with `docker compose exec -T db psql -U hagnos -d hagnos_eggs -f /docker-entrypoint-initdb.d/migrations/001_payment_notifications.sql`.

## Still needed for live money
- Set `PAYSTACK_SECRET_KEY` in `app/.env` (never paste it into chat or commit it). Checkout charges the buyer immediately after they authorize payment; the app records it only after server-side verification of reference, amount, and NGN currency. This integration does not place a card authorization hold or escrow funds until Tuesday.
- Set `SMS_API_KEY`, `SMS_SENDER_ID`, and the account's Termii base URL in `app/.env`. Register the sender ID and enable Termii's DND route for transactional messages. Phone numbers saved as Nigerian local numbers are sent in international `234...` format.
- After changing `app/.env`, run `docker compose up -d --force-recreate web` so the container receives the new credentials.
- Keep the app reachable at the `BETTER_AUTH_URL` callback address on the device used to pay. With a localhost-only host, buyers must complete checkout from a browser that can reach that same local app.
