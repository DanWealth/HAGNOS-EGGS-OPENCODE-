import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const r = await query("SELECT kind, message, created_at FROM notifications ORDER BY created_at DESC LIMIT 30");
  res.status(200).json({ notices: r.rows });
}
