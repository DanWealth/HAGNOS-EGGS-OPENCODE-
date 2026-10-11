import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";

// Admin: list buyers and set roles (buyer_commercial | hub_operator).
export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method === "GET") {
    const r = await query(
      "SELECT u.id, u.email, u.name, u.phone, u.role, u.approved, COALESCE(w.balance,0) AS wallet FROM users u LEFT JOIN wallet_accounts w ON w.user_id=u.id ORDER BY u.email NULLS LAST LIMIT 100"
    );
    return res.status(200).json({ buyers: r.rows });
  }
  if (req.method !== "POST") return res.status(405).end();
  const { id, role, approved } = req.body || {};
  if (role && !["buyer_commercial", "hub_operator"].includes(role)) return res.status(400).json({ error: "bad-role" });
  if (role) await query("UPDATE users SET role=$1 WHERE id=$2", [role, id]);
  if (typeof approved === "boolean") await query("UPDATE users SET approved=$1 WHERE id=$2", [approved, id]);
  res.status(200).json({ ok: true });
}
