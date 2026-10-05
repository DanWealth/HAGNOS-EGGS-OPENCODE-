import { useEffect, useState } from "react";

export default function Driver() {
  const [stops, setStops] = useState(null);
  const [msg, setMsg] = useState("");
  const load = () => fetch("/api/routes").then((r) => r.json()).then((j) => setStops(j.stops || []));
  useEffect(() => { load(); }, []);

  async function delivered(id, crates) {
    setMsg("Saving…");
    const r = await fetch("/api/deliver", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order_id: id, cracked_eggs: 0, empty_crates: crates }) });
    setMsg(r.ok ? "Drop confirmed." : "Failed.");
    load();
  }

  if (!stops) return <p style={{ padding: 20 }}>Loading route…</p>;
  const open = stops.filter((s) => !["Delivered", "Settled", "Cancelled"].includes(s.status));
  return (
    <div style={{ maxWidth: 640, margin: "20px auto", padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>Tuesday run ({open.length} stops)</h1>
      {msg && <p><b>{msg}</b></p>}
      {open.map((s, i) => (
        <div key={s.id} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>#{i + 1} — {s.crates}× {s.size_ordered}</b> — {s.zone}<br />
          <small>{s.address || "No address on file"} • {s.status}</small><br />
          <button onClick={() => delivered(s.id, s.crates)} style={{ marginTop: 6, padding: "10px 14px", fontWeight: 800, borderRadius: 8, border: "2px solid #0A0A0A", background: "#00E676" }}>Confirm drop + {s.crates} empties</button>
        </div>
      ))}
      {open.length === 0 && <p>Route clear. Nothing left to drop.</p>}
    </div>
  );
}
