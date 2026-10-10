import { query } from "../../lib/db";
import { randomUUID } from "crypto";

export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^0\d{10}$/.test(digits)) return `234${digits.slice(1)}`;
  if (/^234\d{10}$/.test(digits)) return digits;
  return null;
}

// Email OR phone gate for the studio.
// GET  /api/account?email=x | ?phone=y -> { exists, user, wallet }
// POST /api/account { email?, phone?, name, role } -> create (or attach email to a phone account)
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email, phone } = req.query;
    const tel = phone ? normalizePhone(phone) : null;
    if (!email && !tel) return res.status(400).json({ error: "email or phone required" });
    const r = email
      ? await query("SELECT id, email, name, phone, role, first_order_done FROM users WHERE LOWER(email)=LOWER($1)", [email])
      : await query("SELECT id, email, name, phone, role, first_order_done FROM users WHERE phone=$1", [tel]);
    if (!r.rows.length) return res.status(200).json({ exists: false });
    const w = await query("SELECT balance FROM wallet_accounts WHERE user_id=$1", [r.rows[0].id]);
    return res.status(200).json({ exists: true, user: r.rows[0], wallet: Number(w.rows[0]?.balance || 0) });
  }
  if (req.method !== "POST") return res.status(405).end();
  const { email, phone, name, role } = req.body || {};
  const tel = normalizePhone(phone);
  const mail = email ? String(email).toLowerCase().trim() : null;
  if (!name) return res.status(400).json({ error: "name required" });
  if (!mail && !tel) return res.status(400).json({ error: "email or phone required" });
  // Attach an email to an existing phone account.
  if (mail && tel) {
    const byPhone = await query("SELECT * FROM users WHERE phone=$1", [tel]);
    if (byPhone.rows.length && !byPhone.rows[0].email) {
      const clash = await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [mail]);
      if (clash.rows.length) return res.status(409).json({ error: "email-taken" });
      await query("UPDATE users SET email=$1 WHERE phone=$2", [mail, tel]);
      return res.status(200).json({ exists: true, id: byPhone.rows[0].id, updated: true });
    }
  }
  const dup = mail
    ? await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [mail])
    : await query("SELECT id FROM users WHERE phone=$1", [tel]);
  if (dup.rows.length) return res.status(200).json({ exists: true, id: dup.rows[0].id });
  const id = randomUUID();
  await query("INSERT INTO users (id, email, name, phone, role) VALUES ($1,$2,$3,$4,$5)",
    [id, mail, name, tel, role === "hub_operator" ? "hub_operator" : "buyer_commercial"]);
  await query("INSERT INTO wallet_accounts (user_id, balance) VALUES ($1,0) ON CONFLICT DO NOTHING", [id]);
  await query("INSERT INTO crate_ledger (user_id, issued, returned) VALUES ($1,0,0) ON CONFLICT DO NOTHING", [id]);
  res.status(201).json({ exists: false, id, created: true });
}
