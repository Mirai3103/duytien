import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { user, user as usersTable } from "@/db/schema";
const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  avatar: z.string().optional(),
});
const usersRoute = router({
  getMyProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    return await db.query.user.findFirst({
      where: eq(user.id, ctx.session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
  }),
  updateMyProfile: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      const user = await db
        .update(usersTable)
        .set({
          name: input.name,
          dateOfBirth: input.dateOfBirth
            ? new Date(input.dateOfBirth)
            : undefined,
          phone: input.phone,
          gender: input.gender,
          image: input.avatar,
        })
        .where(eq(usersTable.id, ctx.session.user.id));
      return { success: true };
    }),
});
export { usersRoute };
