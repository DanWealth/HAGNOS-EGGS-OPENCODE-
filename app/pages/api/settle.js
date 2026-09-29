import { query } from "../../lib/db";

// Tuesday night: release holds for delivered/adjusted orders (funds to farm).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const r = await query(
    "UPDATE orders SET status='Settled' WHERE status IN ('Delivered','Adjusted') RETURNING id, total_held"
  );
  await query("UPDATE payment_holds SET status='captured' WHERE order_id = ANY($1) AND status='held'", [r.rows.map((x) => x.id)]);
  const sum = r.rows.reduce((a, x) => a + Number(x.total_held), 0);
  res.status(200).json({ settled: r.rows.length, farm_payout: sum });
}
