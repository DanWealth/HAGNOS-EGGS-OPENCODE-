import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const r = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 1");
  if (!r.rows.length) return res.status(404).json({ error: "no-price-week" });
  res.status(200).json(r.rows[0]);
}
