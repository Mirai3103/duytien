import { initTRPC, TRPCError } from "@trpc/server";
type Context = {
  session: {
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined | undefined;
      userAgent?: string | null | undefined | undefined;
    };
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined | undefined;
    };
  } | null;
};
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.session.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please login to continue",
    });
  }
  return next({ ctx });
});
