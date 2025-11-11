import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import db from "@/db";
import { and, asc, desc, eq, ilike, not, SQL } from "drizzle-orm";
import { vouchers as vouchersTable } from "@/db/schema";
import { TRPCError } from "@trpc/server";

const getVouchersSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  keyword: z.string().optional(),
  orderBy: z.enum(["createdAt", "usageCount"]).optional().default("createdAt"),
  orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
  type: z.enum(["percentage", "fixed"]).optional(),
});
const createVoucherSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(["percentage", "fixed"]),
  discount: z.number(),
  maxDiscount: z.number().optional(),
  minOrderAmount: z.number().optional(),
  maxOrderAmount: z.number().optional(),
  maxUsage: z.number().optional(),
});
type CheckCanUseVoucherOutput = {
  valid: boolean;
  message: string;
  reducePrice?: number;
  voucher?: {
    id: number;
    name: string;
    discount: string;
    type: "percentage" | "fixed";
    maxDiscount: string | null;
    minOrderAmount: string | null;
    maxOrderAmount: string | null;
    maxUsage: number | null;
    isActive: boolean;
    code: string;
  } | undefined;
};
export const vouchersRoute = router({
  getVouchers: protectedProcedure
    .input(getVouchersSchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, keyword, orderBy, orderDirection, type } = input;
      const offset = (page - 1) * limit;
      const where: SQL[] = [];
      if (keyword) {
        where.push(ilike(vouchersTable.code, `%${keyword}%`)! as SQL);
      }
      if (type) {
        where.push(eq(vouchersTable.type, type)! as SQL);
      }
      const total = await db.$count(vouchersTable, and(...where));
      const vouchers = await db.query.vouchers.findMany({
        where: and(...where),
        orderBy: [
          orderBy
            ? orderBy === "createdAt"
              ? asc(vouchersTable.createdAt)
              : asc(vouchersTable.usageCount)
            : desc(vouchersTable.createdAt),
        ],
        limit: limit,
        offset: offset,
      });
      return {
        vouchers,
        total,
      };
    }),
  checkVoucherCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await db.query.vouchers.findFirst({
        where: eq(vouchersTable.code, input.code),
      });
    }),
  toggleVoucherStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(vouchersTable)
        .set({
          isActive: not(vouchersTable.isActive),
        })
        .where(eq(vouchersTable.id, input.id));
      return {
        success: true,
        message: "Voucher đã được cập nhật",
      };
    }),
  createVoucher: protectedProcedure
    .input(createVoucherSchema)
    .mutation(async ({ ctx, input }) => {
      const existByCode = await db.query.vouchers.findFirst({
        where: eq(vouchersTable.code, input.code),
      });
      if (existByCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mã voucher đã tồn tại",
        });
      }
      const [voucher] = await db
        .insert(vouchersTable)
        .values({
          //   maxUsage: input.maxUsage?.toString(),
          minOrderAmount: input.minOrderAmount?.toString(),
          usageCount: 0,
          code: input.code,
          discount: input.discount.toString(),
          name: input.name,
          type: input.type,
          createdAt: new Date(),
          isActive: true,
          maxDiscount: input.maxDiscount?.toString(),
          maxOrderAmount: input.maxOrderAmount?.toString(),
          maxUsage: input.maxUsage,
        })
        .returning();
      return voucher;
    }),
  updateVoucher: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
        type: z.enum(["percentage", "fixed"]),
        discount: z.number(),
        maxDiscount: z.number().optional(),
        minOrderAmount: z.number().optional(),
        maxOrderAmount: z.number().optional(),
        maxUsage: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingVoucher = await db.query.vouchers.findFirst({
        where: eq(vouchersTable.id, input.id),
      });
      if (!existingVoucher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voucher không tồn tại",
        });
      }
      // Check if code is changed and already exists
      if (input.code !== existingVoucher.code) {
        const existByCode = await db.query.vouchers.findFirst({
          where: eq(vouchersTable.code, input.code),
        });
        if (existByCode) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Mã voucher đã tồn tại",
          });
        }
      }
      const [voucher] = await db
        .update(vouchersTable)
        .set({
          code: input.code,
          name: input.name,
          type: input.type,
          discount: input.discount.toString(),
          maxDiscount: input.maxDiscount?.toString(),
          minOrderAmount: input.minOrderAmount?.toString(),
          maxOrderAmount: input.maxOrderAmount?.toString(),
          maxUsage: input.maxUsage,
        })
        .where(eq(vouchersTable.id, input.id))
        .returning();
      return voucher;
    }),
  deleteVoucher: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(vouchersTable).where(eq(vouchersTable.id, input.id));
      return {
        success: true,
        message: "Voucher đã được xóa",
      };
    }),
    checkCanUseVoucher: protectedProcedure
    .input(
      z.object({
        voucherCode: z.string(),
        orderAmount: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const voucher = await db.query.vouchers.findFirst({
        where: eq(vouchersTable.code, input.voucherCode),
      });
      console.log(voucher,input);
      if (!voucher) {
       return{
        valid: false,
        message: "Voucher không tồn tại",
        reducePrice: 0,
        voucher: undefined,
       } as CheckCanUseVoucherOutput
      }
      if(!voucher.isActive) {
        return{
          valid: false,
          message: "Voucher đã bị vô hiệu hóa",
          reducePrice: 0,
          voucher: undefined,
        } as CheckCanUseVoucherOutput
      }
      if(voucher.maxUsage && voucher.usageCount >= voucher.maxUsage) {
        return{
          valid: false,
          message: "Voucher đã hết số lần sử dụng",
          reducePrice: 0,
          voucher: undefined,
        } as CheckCanUseVoucherOutput
      }
      if(voucher.minOrderAmount && input.orderAmount < Number(voucher.minOrderAmount)) {
        return{
          valid: false,
          message: `Cần tối thiểu ${voucher.minOrderAmount} để sử dụng voucher này`,
          reducePrice: 0,
          voucher: undefined,
        } as CheckCanUseVoucherOutput
      }
      const reducePrice = voucher.type === "percentage" ? input.orderAmount * (Number(voucher.discount) / 100) : Number(voucher.discount);
      return{
        valid: true,
        message: "Voucher có thể sử dụng",
        reducePrice: Math.min(reducePrice, Number(voucher.maxDiscount || Infinity)),
        voucher,
      } as CheckCanUseVoucherOutput;
    }),
    getVoucherByCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await db.query.vouchers.findFirst({
        where: eq(vouchersTable.code, input.code),
      });
    }),
});
