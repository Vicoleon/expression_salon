import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AdminUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@expressionsalon.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("orders.create", () => {
  it("creates an order for public users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const orderData = {
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "+506 1234-5678",
      customerAddress: "Test Address",
      items: [
        {
          productId: 1,
          productName: "Test Product",
          quantity: 2,
          price: 10000,
        },
      ],
      total: 20000,
      notes: "Test order",
    };

    const result = await caller.orders.create(orderData);

    expect(result.success).toBe(true);
    expect(result.orderNumber).toBeDefined();
    expect(result.orderId).toBeDefined();
  });
});

describe("admin.orders.list", () => {
  it("returns all orders for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.orders.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("throws error for non-admin users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.orders.list()).rejects.toThrow();
  });
});
