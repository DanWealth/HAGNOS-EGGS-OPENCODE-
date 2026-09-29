import { query } from "../../lib/db";
import { randomUUID } from "crypto";

// Phase 6: group this week's open orders by zone into routes.
// Truck capacity: 500 crates per truck (over-capacity flagged).
const TRUCK_CAP = 500;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const pw = await query("SELECT id FROM price_weeks ORDER BY week_start DESC LIMIT 1");
    const weekId = pw.rows[0]?.id;
    await query("DELETE FROM routes WHERE price_week_id=$1", [weekId]);
    const zones = ["mainland", "island"];
    const out = [];
    for (const z of zones) {
      const o = await query(
        "SELECT id, crates FROM orders WHERE zone=$1 AND status IN ('FundsHeld','Validated','Adjusted') ORDER BY created_at",
        [z]
      );
      let truck = 1, load = 0;
      for (const row of o.rows) {
        if (load + row.crates > TRUCK_CAP) { truck++; load = 0; }
        load += row.crates;
        await query("INSERT INTO routes (id, price_week_id, zone, stop_order) VALUES ($1,$2,$3,$4)",
          [randomUUID(), weekId, `${z}-truck${truck}`, load]);
        out.push({ order_id: row.id, route: `${z}-truck${truck}` });
      }
    }
    return res.status(201).json({ grouped: out.length, truckCap: TRUCK_CAP });
  }
  const r = await query(
    "SELECT o.id, o.size_ordered, o.crates, o.status, o.zone FROM orders o ORDER BY o.zone, o.created_at DESC LIMIT 50"
  );
  res.status(200).json({ stops: r.rows, truckCap: TRUCK_CAP });
}
