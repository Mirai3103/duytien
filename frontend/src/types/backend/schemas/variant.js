import { z } from "zod";
export var VariantStatus;
(function (VariantStatus) {
    VariantStatus["ACTIVE"] = "active";
    VariantStatus["INACTIVE"] = "inactive";
})(VariantStatus || (VariantStatus = {}));
export const attributeValueSchema = z.object({
    attributeId: z.number(),
    value: z.string(),
});
export const variantSchema = z.object({
    id: z.number(),
    name: z.string(),
    productId: z.number(),
    sku: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
    image: z.string(),
    isDefault: z.boolean(),
    status: z.enum(VariantStatus),
    createdAt: z.date(),
});
export const createVariantSchema = variantSchema
    .omit({
    id: true,
    createdAt: true,
})
    .extend({
    attributeValues: z.array(attributeValueSchema), // tạo bắt buộc thuộc tính cho sản phẩm
});
export const updateVariantSchema = variantSchema.omit({
    createdAt: true,
});
