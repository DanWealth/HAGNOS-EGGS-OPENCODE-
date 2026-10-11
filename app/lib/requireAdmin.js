import { auth } from "./auth";

// Server-side admin gate for money/state-changing endpoints.
// Validates the Better Auth session properly (session tokens are stored
// hashed — never compare the raw cookie against the database), then the
// email must be listed in ADMIN_EMAILS (app/.env, comma-separated).
export async function requireAdmin(req, res) {
  let email = "";
  try {
    const session = await auth.api.getSession({ headers: new Headers(req.headers || {}) });
    email = (session?.user?.email || "").toLowerCase();
  } catch {
    email = "";
  }
  if (!email) {
    res.status(401).json({ error: "sign-in required" });
    return false;
  }
  const allow = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!allow.includes(email)) {
    res.status(403).json({ error: "admin only" });
    return false;
  }
  return true;
}
