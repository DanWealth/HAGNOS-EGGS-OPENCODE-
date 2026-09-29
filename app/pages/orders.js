import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    fetch("/api/orders-list").then((r) => r.json()).then((j) => setOrders(j.orders || []));
  }, []);
  if (!orders) return <p style={{ padding: 20 }}>Loading your orders…</p>;
  return (
    <div style={{ maxWidth: 640, margin: "20px auto", padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>My orders</h1>
      {orders.map((o) => (
        <div key={o.id} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>{o.order_no || o.id.slice(0, 8)}</b> — {o.crates}× {o.size_ordered}<br />
          <small>Held ₦{Number(o.total_held).toLocaleString()} • {o.status} • {o.zone}{o.address ? ` • ${o.address}` : ""}</small>
        </div>
      ))}
      {orders.length === 0 && <p>No orders yet. Order on Monday.</p>}
    </div>
  );
}
