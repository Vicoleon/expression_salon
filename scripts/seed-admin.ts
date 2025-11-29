import "dotenv/config";
import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function seedAdmin() {
    const db = await getDb();
    if (!db) {
        console.error("Database connection failed");
        process.exit(1);
    }

    const username = "admin";
    const password = "password123"; // Change this in production!
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Seeding admin user: ${username}`);

    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (existingUser.length > 0) {
        console.log("Admin user already exists, updating password...");
        await db.update(users).set({
            password: hashedPassword,
            role: "admin",
        }).where(eq(users.username, username));
    } else {
        console.log("Creating new admin user...");
        await db.insert(users).values({
            openId: `local-${nanoid()}`,
            username,
            password: hashedPassword,
            role: "admin",
            name: "Administrator",
            loginMethod: "local",
        });
    }

    console.log("Admin user seeded successfully.");
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
});
