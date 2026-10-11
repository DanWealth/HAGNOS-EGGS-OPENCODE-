import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query(text, params) {
  const r = await pool.query(text, params);
  return r;
}
