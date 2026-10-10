import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";
import { randomUUID } from "crypto";

// Admin sets next week's prices (PRD §5, criterion 1). Sunday-night action.
export default async function handler(req, res) {
  if (req.method === "GET") {
    const r = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 5");
    return res.status(200).json({ weeks: r.rows });
  }
  if (req.method !== "POST") return res.status(405).end();
  if (!(await requireAdmin(req, res))) return;
  const { week_start, large_price, medium_price, pullet_price, hub_discount_pct, mainland_fee, island_fee, crate_fee } = req.body || {};
  if (!week_start || !large_price || !medium_price || !pullet_price) return res.status(400).json({ error: "missing-prices" });
  const id = randomUUID();
  await query(
    "INSERT INTO price_weeks (id, week_start, large_price, medium_price, pullet_price, hub_discount_pct, mainland_fee, island_fee, crate_fee) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (week_start) DO UPDATE SET large_price=$3, medium_price=$4, pullet_price=$5",
    [id, week_start, large_price, medium_price, pullet_price, hub_discount_pct || 5, mainland_fee || 2500, island_fee || 4000, crate_fee || 1500]
  );
  res.status(201).json({ ok: true });
}
