import { GoogleGenerativeAI } from "@google/generative-ai";

// Farm-fresh visual studio (PRD visual experience). Uses Gemini image
// generation + editing. Activates when GEMINI_API_KEY is set server-side.
// Key must NEVER be pasted in chat or committed — local app/.env only.
const MODEL = "gemini-2.0-flash-preview-image-generation";

export function geminiReady() {
  return !!process.env.GEMINI_API_KEY;
}

function client() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: MODEL });
}

// prompt: what the customer described. prior: { base64, mimeType } of the
// previous version for continuous editing (undefined = fresh visual).
export async function makeVisual(prompt, prior) {
  const parts = [];
  if (prior?.base64) parts.push({ inlineData: { data: prior.base64, mimeType: prior.mimeType || "image/png" } });
  parts.push({ text: `Farm-fresh egg marketplace visual, bright daylight, appetizing and clean. Customer request: ${prompt}` });
  const res = await client().generateContent({ contents: [{ role: "user", parts }] });
  const out = res.response.candidates?.[0]?.content?.parts || [];
  for (const p of out) {
    if (p.inlineData?.data) return { base64: p.inlineData.data, mimeType: p.inlineData.mimeType || "image/png" };
  }
  const text = out.map((p) => p.text || "").join(" ").slice(0, 500);
  return { note: text || "No image returned — try a more visual description." };
}
