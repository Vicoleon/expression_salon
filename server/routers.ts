import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      const { getPublishedBlogPosts } = await import("./db");
      return getPublishedBlogPosts();
    }),
    getBySlug: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "slug" in val) {
          return val as { slug: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getBlogPostBySlug } = await import("./db");
        return getBlogPostBySlug(input.slug);
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const { getAllProducts } = await import("./db");
      return getAllProducts();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "id" in val) {
          return val as { id: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getProductById } = await import("./db");
        return getProductById(input.id);
      }),
    getByCategory: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "category" in val) {
          return val as { category: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getProductsByCategory } = await import("./db");
        return getProductsByCategory(input.category);
      }),
  }),

  admin: router({
    // Products management
    products: router({
      list: adminProcedure.query(async () => {
        const { getAllProductsAdmin } = await import("./db");
        return getAllProductsAdmin();
      }),
      create: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null) {
            return val as {
              name: string;
              description?: string;
              price: number;
              category?: string;
              stock: number;
              imageUrl?: string;
            };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { products } = await import("../drizzle/schema");
          await db.insert(products).values({
            name: input.name,
            description: input.description,
            price: input.price,
            category: input.category,
            stock: input.stock,
            imageUrl: input.imageUrl,
            isActive: 1,
          });
          return { success: true };
        }),
      update: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as {
              id: number;
              name?: string;
              description?: string;
              price?: number;
              category?: string;
              stock?: number;
              imageUrl?: string;
              isActive?: number;
            };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { products } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const { id, ...updateData } = input;
          await db.update(products).set(updateData).where(eq(products.id, id));
          return { success: true };
        }),
      delete: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as { id: number };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { products } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await db.update(products).set({ isActive: 0 }).where(eq(products.id, input.id));
          return { success: true };
        }),
    }),

    // Blog management
    blog: router({
      list: adminProcedure.query(async () => {
        const { getAllBlogPosts } = await import("./db");
        return getAllBlogPosts();
      }),
      getById: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as { id: number };
          }
          throw new Error("Invalid input");
        })
        .query(async ({ input }) => {
          const { getBlogPostById } = await import("./db");
          return getBlogPostById(input.id);
        }),
      create: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null) {
            return val as {
              title: string;
              slug: string;
              content: string;
              excerpt?: string;
              imageUrl?: string;
              isPublished: number;
            };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input, ctx }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { blogPosts } = await import("../drizzle/schema");
          await db.insert(blogPosts).values({
            ...input,
            authorId: ctx.user.id,
            publishedAt: input.isPublished === 1 ? new Date() : null,
          });
          return { success: true };
        }),
      update: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as {
              id: number;
              title?: string;
              slug?: string;
              content?: string;
              excerpt?: string;
              imageUrl?: string;
              isPublished?: number;
            };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { blogPosts } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const { id, isPublished, ...updateData } = input;
          const finalData: Record<string, unknown> = { ...updateData };
          if (isPublished !== undefined) {
            finalData.isPublished = isPublished;
            if (isPublished === 1) {
              finalData.publishedAt = new Date();
            }
          }
          await db.update(blogPosts).set(finalData).where(eq(blogPosts.id, id));
          return { success: true };
        }),
      delete: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as { id: number };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { blogPosts } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
          return { success: true };
        }),
    }),

    // Orders management
    orders: router({
      list: adminProcedure.query(async () => {
        const { getAllOrders } = await import("./db");
        return getAllOrders();
      }),
      getById: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val) {
            return val as { id: number };
          }
          throw new Error("Invalid input");
        })
        .query(async ({ input }) => {
          const { getOrderById, getOrderItems } = await import("./db");
          const order = await getOrderById(input.id);
          if (!order) return null;
          const items = await getOrderItems(input.id);
          return { ...order, items };
        }),
      updateStatus: adminProcedure
        .input((val: unknown) => {
          if (typeof val === "object" && val !== null && "id" in val && "status" in val) {
            return val as { id: number; status: string };
          }
          throw new Error("Invalid input");
        })
        .mutation(async ({ input }) => {
          const db = await import("./db").then((m) => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { orders } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await db.update(orders).set({ status: input.status as any }).where(eq(orders.id, input.id));
          return { success: true };
        }),
    }),
  }),

  // Public order creation
  orders: router({
    create: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          return val as {
            customerName: string;
            customerEmail: string;
            customerPhone?: string;
            customerAddress?: string;
            items: Array<{ productId: number; productName: string; quantity: number; price: number }>;
            total: number;
            notes?: string;
          };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ input }) => {
        const db = await import("./db").then((m) => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { orders, orderItems } = await import("../drizzle/schema");
        
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Create order
        await db.insert(orders).values({
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          total: input.total,
          status: "pending",
          paymentMethod: "bank_transfer",
          notes: input.notes,
        });
        
        // Get the created order ID
        const { eq } = await import("drizzle-orm");
        const createdOrder = await db.select().from(orders)
          .where(eq(orders.orderNumber, orderNumber))
          .limit(1);
        
        if (!createdOrder || createdOrder.length === 0) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create order" });
        }
        
        const orderId = createdOrder[0].id;
        
        // Create order items
        for (const item of input.items) {
          await db.insert(orderItems).values({
            orderId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          });
        }
        
        return { success: true, orderNumber, orderId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
