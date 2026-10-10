import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { email } = req.query;
  const u = email
    ? await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [email])
    : await query("SELECT id FROM users LIMIT 1");
  if (!u.rows.length) return res.status(200).json({ balance: 0, history: [] });
  const b = await query("SELECT balance FROM wallet_accounts WHERE user_id=$1", [u.rows[0].id]);
  const h = await query("SELECT amount, reason, created_at FROM wallet_tx WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20", [u.rows[0].id]);
  res.status(200).json({ balance: Number(b.rows[0]?.balance || 0), history: h.rows });
}
