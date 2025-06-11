import { db } from "@/server/db/index";

await db.execute("DROP SCHEMA public CASCADE");
await db.execute("CREATE SCHEMA public");
console.log("Database reset complete.");
