import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { getSessionCookieOptions } from "../_core/cookies";
import { sdk } from "../_core/sdk";
import { publicProcedure, router } from "../_core/trpc";
import { getUserByUsername } from "../db";

export const authLocalRouter = router({
    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await getUserByUsername(input.username);

            if (!user || !user.password) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password",
                });
            }

            const isValid = await bcrypt.compare(input.password, user.password);

            if (!isValid) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password",
                });
            }

            // Create session token
            const sessionToken = await sdk.signSession({
                openId: user.openId,
                appId: "local-admin",
                name: user.name || user.username || "Admin",
            });

            // Set cookie
            const cookieOptions = getSessionCookieOptions(ctx.req);
            ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                },
            };
        }),
});
