import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

export const auth = betterAuth({
  database: {
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
    }),
    type: "postgres",
  },
  emailAndPassword: { enabled: true },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
