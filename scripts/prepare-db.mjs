import { existsSync, readFileSync, writeFileSync, mkdirSync, closeSync, openSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";

if (!existsSync(".env")) {
  writeFileSync(
    ".env",
    readFileSync(".env.example", "utf8").replace(
      "replace-with-output-of-openssl-rand-base64-32",
      randomBytes(32).toString("base64"),
    ),
  );
  console.log("Created .env with a random local authentication secret.");
}

config({ quiet: true });

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

if (!url.startsWith("file:")) throw new Error("DATABASE_URL must point to a local SQLite file.");

const path = resolve(url.slice(5));

mkdirSync(dirname(path), { recursive: true });

closeSync(openSync(path, "a"));
