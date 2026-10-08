import { useState } from "react";
import { theme as C } from "../lib/theme";

const IDEAS = [
  "30 large brown eggs in a clear plastic crate, farm sunrise behind",
  "Same crates stacked for a bakery delivery, kraft boxes beside them",
  "Close-up of glossy farm-fresh eggs in a woven basket on wood",
];

export default function Visuals() {
  const [prompt, setPrompt] = useState("");
  const [shots, setShots] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function send(text) {
    const p = (text ?? prompt).trim();
    if (!p || busy) return;
    setBusy(true);
    setMsg("Painting…");
    try {
      const prior = shots.length ? { base64: shots[shots.length - 1].base64, mimeType: shots[shots.length - 1].mimeType } : undefined;
      const r = await fetch("/api/visuals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: p, prior }) });
      const j = await r.json();
      if (j.base64) {
        setShots((s) => [...s, { base64: j.base64, mimeType: j.mimeType, prompt: p }]);
        setMsg(`Version ${shots.length + 1} — describe a change to refine it.`);
        setPrompt("");
      } else setMsg(j.message || j.note || j.error || "Try again.");
    } catch {
      setMsg("Could not reach the studio. Is the app running?");
    }
    setBusy(false);
  }

  const input = { flex: 1, padding: 14, borderRadius: 10, border: `2px solid ${C.ink}`, fontSize: 16 };
  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.ink, color: "#fff", padding: 20, borderBottom: `6px solid ${C.volt}` }}>
        <h1 style={{ margin: 0 }}>Farm-fresh <span style={{ color: C.sun }}>visual studio</span></h1>
        <p>Describe what you want — each message refines the last visual. <a style={{ color: C.sun }} href="/order">Place your order →</a></p>
      </div>
      <div style={{ maxWidth: 760, margin: "20px auto", padding: 12, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={input} value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder='e.g. "12 crates of medium eggs in branded Hagnos boxes, delivery van behind"' />
          <button disabled={busy} onClick={() => send()} style={{ padding: "14px 20px", fontWeight: 900, borderRadius: 10, border: `2px solid ${C.ink}`, background: busy ? "#999" : C.volt }}>Paint</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {IDEAS.map((t) => (<button key={t} onClick={() => send(t)} style={{ padding: "8px 12px", borderRadius: 20, border: `2px solid ${C.ink}`, background: "#fff", fontWeight: 700, fontSize: 13 }}>{t.slice(0, 42)}…</button>))}
        </div>
        {msg && <p><b>{msg}</b></p>}
        {[...shots].reverse().map((s, i) => (
          <div key={shots.length - i} style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, overflow: "hidden", boxShadow: `4px 4px 0 ${C.ink}` }}>
            <img src={`data:${s.mimeType};base64,${s.base64}`} alt={s.prompt} style={{ width: "100%", display: "block" }} />
            <p style={{ padding: "8px 14px", margin: 0 }}><small><b>v{shots.length - i}</b> — {s.prompt}</small></p>
          </div>
        ))}
        {shots.length === 0 && (
          <div style={{ background: "#fff", border: `2px dashed ${C.ink}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
            <p style={{ fontSize: 18 }}>🥚 Your farm-fresh visuals appear here.<br /><small>Eggs, farms, packaging, deliveries — describe anything.</small></p>
          </div>
        )}
      </div>
    </div>
  );
}
