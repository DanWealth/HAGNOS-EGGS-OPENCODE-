import { Pool } from "pg";

// Local Docker uses DATABASE_URL; Netlify Database (Neon) provides
// NETLIFY_DATABASE_URL automatically once the extension is installed.
const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

const pool = new Pool({ connectionString });

export async function query(text, params) {
  const r = await pool.query(text, params);
  return r;
}
