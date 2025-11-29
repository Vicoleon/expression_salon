import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { createPool } from "mysql2/promise";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const connectionString = process.env.DATABASE_URL;
      const isTiDB = connectionString.includes("tidbcloud");

      const connectionParams = {
        uri: connectionString.split('?')[0],
        ssl: isTiDB ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
      };

      const pool = createPool(connectionParams);
      _db = drizzle(pool, { mode: "default" });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  const { products } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  return db.select().from(products).where(eq(products.isActive, 1));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { products } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  const result = await db.select().from(products)
    .where(and(eq(products.id, id), eq(products.isActive, 1)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  const { products } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  return db.select().from(products)
    .where(and(eq(products.category, category), eq(products.isActive, 1)));
}

// Blog queries
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];

  const { blogPosts } = await import("../drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");

  return db.select().from(blogPosts)
    .where(eq(blogPosts.isPublished, 1))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const { blogPosts } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  const result = await db.select().from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, 1)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { blogPosts } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Admin queries
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];

  const { blogPosts } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getAllProductsAdmin() {
  const db = await getDb();
  if (!db) return [];

  const { products } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  return db.select().from(products).orderBy(desc(products.createdAt));
}

// Order queries
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];

  const { orders } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { orders } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const result = await db.select().from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  const { orderItems } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}
