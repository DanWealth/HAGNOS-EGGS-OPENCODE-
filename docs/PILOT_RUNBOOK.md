# Phase 9 — Pilot Runbook (2 Tuesdays, 1 farm, 5–10 buyers)

## Sunday night (Admin)
1. Open /prices, set next Monday's Large / Medium / Pullet prices.
2. Freeze prices — no edits after Monday 00:00.

## Monday (Buyers)
1. Buyers open http://localhost:3000, pick size + crates (min 10) + address.
2. Wallet applies first, remainder held. Admin watches /admin holds total.
3. 18:00: send cutoff reminder (notices feed; SMS later via Termii).
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

## Still needed for live money
- PAYSTACK_SECRET_KEY in app/.env (see app/.env.example).
- SMS_API_KEY for Termii/Africa's Talking.
