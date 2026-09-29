import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const r = await query("SELECT u.id, u.phone, COALESCE(c.issued,0) AS issued, COALESCE(c.returned,0) AS returned, COALESCE(c.issued,0)-COALESCE(c.returned,0) AS owed FROM users u LEFT JOIN crate_ledger c ON c.user_id=u.id");
  res.status(200).json({ crates: r.rows });
}
