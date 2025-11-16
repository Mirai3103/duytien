import { ProductStatus } from "@/schemas/product";
import { getAllCategories } from "@/services/category";
import { getProductDetail, getProducts } from "@/services/product";
import * as CartService from "@/services/cart";
import { tool } from "ai";
import { z } from "zod";
import { getVariantDetail } from "@/services/variant";
 const productsQuerySchema = z.object({
    page: z.number().default(1),
    limit: z.number().max(200).default(10),
    keyword: z.string().optional(),
    brandId: z
      .array(z.number())
      .optional(),
    categoryId: z
      .array(z.number())
      .optional(),
    sort: z
      .object({
        field: z.enum(["price", "name", "status", "createdAt"]).optional(),
        direction: z.enum(["asc", "desc"]).optional(),
      })
      .optional(),
    price: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional(),
    status: z.array(z.enum(ProductStatus)).optional(),
  });
export const searchProductTool = tool({
  name: "searchProduct",
  description: "Search for a product with filters",
  inputSchema: productsQuerySchema,
  execute: async (input) => {
    const products = await getProducts(input);
    // remove description and metadata and variantsAggregate
    const productsWithoutDescriptionAndMetadataAndVariantsAggregate = products.map((product) => {
      return {
        ...product,
        description: undefined,
        metadata: undefined,
        variantsAggregate: undefined,
      };
    });
    return productsWithoutDescriptionAndMetadataAndVariantsAggregate;
  },
});
export const getProductDetailTool = tool({
  name: "getProductDetail",
  description: "Get the detail of a product",
  inputSchema: z.object({
    id: z.number(),
  }),
  execute: async (input) => {
    const product = await getProductDetail(input.id);
    // remove description and metadata and variantsAggregate
    const productWithoutDescriptionAndMetadataAndVariantsAggregate = {
      ...product,
      description: undefined,
      metadata: undefined,
      variantsAggregate: undefined,
    };
    return productWithoutDescriptionAndMetadataAndVariantsAggregate;
  },
});

export const getAllCategoriesTool = tool({
  name: "getAllCategories",
  description: "Get all categories",
  inputSchema: z.object({}),
  execute: async (input) => {
    const categories = await getAllCategories();
    return categories;
  },
});
export const createAddToCartTool = (userId: string) => tool({
  name: "createAddToCart",
  description: "Create a new add to cart",
  inputSchema: z.object({
    productVariantId: z.number(),
    quantity: z.number(),
  }),
  execute: async (input) => {
    const addToCart = await CartService.addToCart(userId, {
      quantity: input.quantity,
      variantId: input.productVariantId,
    });
    return { success: true };
  },
});
export const getVariantDetailTool = tool({
  name: "getVariantDetail",
  description: "Get the detail of a variant",
  inputSchema: z.object({
    id: z.number(),
  }),
  execute: async (input) => {
    const variant = await getVariantDetail(input.id);
    return variant;
  },
});