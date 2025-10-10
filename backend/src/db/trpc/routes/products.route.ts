import z from "zod"
import { publicProcedure, router } from "../trpc"
import db from "@/db"

const  productsQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().max(200).default(10),
})

export const productsRoute = router({
  getProducts: publicProcedure.query(async () => {
    return await db.query.products
  })
})