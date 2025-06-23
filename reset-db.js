import { db } from "@/server/db/index";
const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const { messages, rooms } = require("./src/server/db/schema");

await db.execute("DROP SCHEMA public CASCADE");
await db.execute("CREATE SCHEMA public");
console.log("Database reset complete.");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/live_feedback_wall";

const sql = postgres(connectionString);
const db = drizzle(sql);

async function resetDatabase() {
  try {
    console.log("🗑️  Resetting database...");

    // Clear existing data
    await db.delete(messages);
    await db.delete(rooms);

    // Create test room
    const [room] = await db
      .insert(rooms)
      .values({
        roomCode: "test123",
        name: "Test Room",
      })
      .returning();

    console.log("✅ Created test room:", room);

    // Generate test messages
    const testMessages = [];
    for (let i = 1; i <= 50; i++) {
      testMessages.push({
        roomId: room.id,
        content: `Test message ${i} - ${new Date().toISOString()}`,
        createdAt: new Date(Date.now() - (50 - i) * 60000), // Each message 1 minute apart
      });
    }

    await db.insert(messages).values(testMessages);
    console.log("✅ Created 50 test messages");

    console.log("🎉 Database reset complete!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await sql.end();
  }
}

resetDatabase();
