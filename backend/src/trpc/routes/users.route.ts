import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { user as usersTable } from "@/db/schema";
import { auth } from "@/auth";
const usersRoute = router({
  getMyProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    return ctx.session.user;
  }),
  updateMyProfile: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.date().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      const user = await db
        .update(usersTable)
        .set({
          name: input.name,
          dateOfBirth: input.dateOfBirth,
          phone: input.phone,
          gender: input.gender,
          image: input.avatar,
        })
        .where(eq(usersTable.id, ctx.session.user.id));
      return user;
    }),
});
export { usersRoute };
