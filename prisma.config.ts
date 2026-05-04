import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.development" });

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Make sure your .env file exists in the project root " +
      "and contains DATABASE_URL=...",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
