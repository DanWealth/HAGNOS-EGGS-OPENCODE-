import { useState } from "react";
import { theme as C } from "../lib/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function call(path) {
    setMsg("…");
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: email.split("@")[0] }),
    });
    const j = await r.json().catch(() => ({}));
    setMsg(r.ok ? "Done! You are signed in." : `Failed: ${j.message || r.status}`);
  }

  const input = { width: "100%", padding: 12, border: `2px solid ${C.ink}`, borderRadius: 8, fontSize: 16, marginTop: 8 };
  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>Sign in — Hagnos Eggs</h1>
      <label><b>Email</b><input style={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@bakery.com" /></label>
      <label><b>Password</b><input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => call("/api/auth/sign-in/email")} style={{ flex: 1, padding: 12, fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.volt }}>Sign in</button>
        <button onClick={() => call("/api/auth/sign-up/email")} style={{ flex: 1, padding: 12, fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.sun }}>Create account</button>
      </div>
      {msg && <p><b>{msg}</b></p>}
    </div>
  );
}
