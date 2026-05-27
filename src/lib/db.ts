import { PrismaClient } from "@prisma/client";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
declare global {
  var __prisma__: PrismaClient | undefined;
}

export const db =
  global.__prisma__ ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = db;
}
