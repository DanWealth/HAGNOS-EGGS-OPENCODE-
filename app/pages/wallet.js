import { useEffect, useState } from "react";

export default function Wallet() {
  const [w, setW] = useState(null);
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    fetch("/api/wallet" + (email ? `?email=${encodeURIComponent(email)}` : "")).then((r) => r.json()).then(setW);
  }, []);
  if (!w) return <p style={{ padding: 20 }}>Loading wallet…</p>;
  return (
    <div style={{ maxWidth: 640, margin: "20px auto", padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>Wallet: ₦{Number(w.balance).toLocaleString()}</h1>
      <p>Credits apply first on your next order.</p>
      {(w.history || []).map((t, i) => (
        <div key={i} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>{t.amount > 0 ? "+" : ""}₦{Number(t.amount).toLocaleString()}</b> — {t.reason}
          <br /><small>{String(t.created_at).slice(0, 10)}</small>
        </div>
      ))}
      {(w.history || []).length === 0 && <p>No wallet activity yet.</p>}
    </div>
  );
}
