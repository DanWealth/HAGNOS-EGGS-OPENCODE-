import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/orders-list").then((r) => r.json()).then(setData);
  }, []);
  if (!data) return <p style={{ padding: 20 }}>Loading holds…</p>;
  return (
    <div style={{ fontFamily: "Inter, system-ui", padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1>Admin — Monday holds: ₦{Number(data.totalHeld).toLocaleString()}</h1>
      {data.orders.map((o) => (
        <div key={o.id} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>{o.crates}× {o.size_ordered}</b> — ₦{Number(o.total_held).toLocaleString()} — {o.status} — {o.zone}
        </div>
      ))}
      {data.orders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}
