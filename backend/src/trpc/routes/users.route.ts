import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import z from "zod";
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  ilike,
  or,
  SQL,
} from "drizzle-orm";
import db from "@/db";
import { user, user as usersTable, orders as ordersTable } from "@/db/schema";
const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  avatar: z.string().optional(),
});

const searchUsersSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  search: z.string().optional(),
  emailVerified: z.boolean().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional()
    .nullable(),
  orderBy: z.enum(["createdAt", "name"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
});

const usersRoute = router({
  searchUsers: protectedProcedure
    .input(searchUsersSchema)
    .query(async ({ ctx, input }) => {
      const page = input.page ?? 1;
      const limit = input.limit ?? 20;
      const offset = (page - 1) * limit;
      const conditions: SQL[] = [];

      // Search by name, email, phone
      if (input.search) {
        conditions.push(
          or(
            ilike(usersTable.name, `%${input.search}%`),
            ilike(usersTable.email, `%${input.search}%`),
            ilike(usersTable.phone, `%${input.search}%`)
          )! as SQL
        );
      }

      // Filter by email verified status
      if (input.emailVerified !== undefined) {
        conditions.push(eq(usersTable.emailVerified, input.emailVerified));
      }

      // Filter by date range
      if (input.dateRange && input.dateRange.from && input.dateRange.to) {
        conditions.push(
          between(
            usersTable.createdAt,
            input.dateRange.from,
            input.dateRange.to
          )
        );
      }

      // Build order by
      let orderByClause;
      if (input.orderBy === "name") {
        orderByClause =
          input.orderDirection === "asc"
            ? asc(usersTable.name)
            : desc(usersTable.name);
      } else {
        orderByClause =
          input.orderDirection === "asc"
            ? asc(usersTable.createdAt)
            : desc(usersTable.createdAt);
      }

      // Get users with order count and total spent
      const users = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          phone: usersTable.phone,
          image: usersTable.image,
          emailVerified: usersTable.emailVerified,
          createdAt: usersTable.createdAt,
          totalOrders: usersTable.totalOrders,
          totalAmount: usersTable.totalAmount,
          status: usersTable.status,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(usersTable.id)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      // Get total count
      const totalCount = await db.$count(
        usersTable,
        conditions.length > 0 ? and(...conditions) : undefined
      );

      return {
        users,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

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
        role: true,
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
