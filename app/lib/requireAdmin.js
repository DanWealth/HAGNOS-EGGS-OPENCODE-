import { query } from "./db";

// Server-side admin gate for money/state-changing endpoints.
// Better Auth session cookies arrive as "token.signature" while the
// database stores the raw token, so compare only the part before ".".
// The email must then be listed in ADMIN_EMAILS (app/.env, comma-separated).
export async function requireAdmin(req, res) {
  const raw = req.headers.cookie || "";
  const jar = Object.fromEntries(
    raw.split(";").map((c) => {
      const i = c.indexOf("=");
      return [c.slice(0, i).trim(), (c.slice(i + 1) || "").trim()];
    }).filter(([k]) => k)
  );
  const token = decodeURIComponent(jar["better-auth.session_token"] || "").split(".")[0];
  if (!token) {
    res.status(401).json({ error: "sign-in required" });
    return false;
  }
  const s = await query(
    'SELECT u.email FROM session s JOIN "user" u ON u.id=s."userId" WHERE s.token=$1 AND s."expiresAt" > NOW()',
    [token]
  );
  const email = (s.rows[0]?.email || "").toLowerCase();
  const allow = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!email || !allow.includes(email)) {
    res.status(403).json({ error: "admin only" });
    return false;
  }
  return true;
}
