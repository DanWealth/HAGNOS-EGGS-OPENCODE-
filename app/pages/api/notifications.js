import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { user_id, email } = req.query;
  let uid = user_id;
  if (!uid && email) {
    const u = await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [email]);
    uid = u.rows[0]?.id;
  }
  const r = uid
    ? await query("SELECT kind, message, created_at FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30", [uid])
    : await query("SELECT kind, message, created_at FROM notifications ORDER BY created_at DESC LIMIT 30");
  res.status(200).json({ notices: r.rows });
}
