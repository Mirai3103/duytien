import { z } from "zod";
import slugify from "slugify";
export var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
})(ProductStatus || (ProductStatus = {}));
export const productsQuerySchema = z.object({
    page: z.number().default(1),
    limit: z.number().max(200).default(10),
    keyword: z.string().optional(),
    brandId: z
        .array(z.number())
        .transform((val) => (val.includes(0) ? null : val))
        .optional(),
    categoryId: z
        .array(z.number())
        .transform((val) => (val.includes(0) ? null : val))
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
const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z
        .string()
        .transform((val) => slugify(val, { lower: true, strict: true }) + "-" + Date.now()),
    description: z.any().optional(),
    brandId: z.number().optional(),
    categoryId: z.number().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(ProductStatus),
    createdAt: z.date(),
    price: z.number(),
});
export const createProductSchema = productSchema.omit({
    id: true,
    createdAt: true,
});
export const updateProductSchema = productSchema.omit({
    createdAt: true,
});
