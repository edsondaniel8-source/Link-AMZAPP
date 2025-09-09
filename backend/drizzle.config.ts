import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/database-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
   verbose: true,
  strict: true,
  breakpoints: true,
});