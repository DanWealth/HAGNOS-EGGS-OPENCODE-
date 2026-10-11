import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";

// §21 pull-forward (simple version): average crates/week per size over past
// fulfilled weeks + 10% buffer = suggested farm order for Tuesday.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!(await requireAdmin(req, res))) return;
  const r = await query(
    `SELECT size_ordered, date_trunc('week', created_at)::date AS wk, SUM(crates) AS crates
     FROM orders WHERE status IN ('Delivered','Settled','Adjusted')
     GROUP BY size_ordered, wk ORDER BY wk DESC LIMIT 24`
  );
  const bySize = {};
  for (const row of r.rows) {
    (bySize[row.size_ordered] = bySize[row.size_ordered] || []).push(Number(row.crates));
  }
  const out = Object.entries(bySize).map(([size, weeks]) => {
    const avg = weeks.reduce((a, b) => a + b, 0) / weeks.length;
    return { size, weeksUsed: weeks.length, avgPerWeek: Math.round(avg), suggested: Math.ceil(avg * 1.1) };
  });
  res.status(200).json({ forecast: out });
}
