import { query } from "../../lib/db";
import { randomUUID } from "crypto";

// Email gate for the studio (PRD buyer journey: log in -> order).
// GET  /api/account?email=x -> { exists, user }
// POST /api/account { email, name, phone, role } -> creates buyer + wallet
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email required" });
    const r = await query("SELECT id, email, name, phone, role, first_order_done FROM users WHERE LOWER(email)=LOWER($1)", [email]);
    if (!r.rows.length) return res.status(200).json({ exists: false });
    const w = await query("SELECT balance FROM wallet_accounts WHERE user_id=$1", [r.rows[0].id]);
    return res.status(200).json({ exists: true, user: r.rows[0], wallet: Number(w.rows[0]?.balance || 0) });
  }
  if (req.method !== "POST") return res.status(405).end();
  const { email, name, phone, role, shop_address, zone, weekly_volume } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: "email and name required" });
  const ex = await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [email]);
  if (ex.rows.length) return res.status(200).json({ exists: true, id: ex.rows[0].id });
  const id = randomUUID();
  const isHub = role === "hub_operator";
  await query("INSERT INTO users (id, email, name, phone, role, shop_address, zone, weekly_volume) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, email.toLowerCase(), name, phone || null, isHub ? "hub_operator" : "buyer_commercial", shop_address || null, zone || null, (parseInt(weekly_volume) || null)]);
  await query("INSERT INTO wallet_accounts (user_id, balance) VALUES ($1,0) ON CONFLICT DO NOTHING", [id]);
  await query("INSERT INTO crate_ledger (user_id, issued, returned) VALUES ($1,0,0) ON CONFLICT DO NOTHING", [id]);
  res.status(201).json({ exists: false, id, created: true });
}
