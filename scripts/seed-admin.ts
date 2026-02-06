import "dotenv/config";
import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedAdmin() {
    const db = await getDb();
    if (!db) {
        console.error("Failed to connect to DB");
        process.exit(1);
    }

    const username = "admin";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin exists
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (existing.length > 0) {
        console.log("Admin user already exists");
    } else {
        console.log("Creating admin user...");
        await db.insert(users).values({
            username,
            password: hashedPassword,
            name: "Admin User",
            role: "admin",
            openId: "local-admin",
            email: "admin@example.com",
            loginMethod: "local"
        });
        console.log("Admin user created");
    }

    process.exit(0);
}

seedAdmin().catch(console.error);
