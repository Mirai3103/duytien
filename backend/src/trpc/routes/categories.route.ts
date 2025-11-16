import { categoryCreate, categoryUpdate } from "@/schemas/category";
import z from "zod";
import { publicProcedure, router } from "../trpc";
import * as CategoryService from "@/services/category";

export const categoriesRoute = router({
  getAllParentCategories: publicProcedure.query(async () => {
    return await CategoryService.getAllParentCategories();
  }),
  getByParentId: publicProcedure
    .input(z.object({ parentId: z.string() }))
    .query(async ({ input }) => {
      return await CategoryService.getByParentId(input);
    }),
  getAllParents: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ input }) => {
      return await CategoryService.getAllParents(input);
    }),
  create: publicProcedure.input(categoryCreate).mutation(async ({ input }) => {
    return await CategoryService.createCategory(input);
  }),
  update: publicProcedure.input(categoryUpdate).mutation(async ({ input }) => {
    return await CategoryService.updateCategory(input);
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await CategoryService.deleteCategory(input);
    }),
});
