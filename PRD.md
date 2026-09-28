# PRD Notes — Hagnos Eggs

Source of truth for features: `HAGNOS Eggs PRD.docx`.
This file records tool choices and changes you asked for.

## Tool choice I asked about: database host
- Question: Should we use Neon/Supabase (paid cloud) or Postgres on my own computer?
- Decision: **Postgres on my own computer (local, Docker).**
- Why:
  1. Free — no monthly fee.
  2. Works offline on your device.
  3. Same Postgres skills transfer to cloud later.
  4. Your data stays with you during pilot.

## Changes you told me to make (log)
1. Database → local Postgres. (Free; alternatives: SQLite for dev only, MariaDB, MySQL Community.)
2. Login → Better Auth (email + phone code).
3. File storage → Cloudflare R2.
4. Do NOT use Supabase (or Neon).
5. Do NOT use Vercel — host on local device with Docker.
6. Colors → very bright, sharp contrast (volt, sun, tang, sky, grape, rose).
7. Work one phase at a time; keep talk simple and clear.
