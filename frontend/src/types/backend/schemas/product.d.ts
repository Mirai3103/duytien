import { z } from "zod";
export declare enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare const productsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    keyword: z.ZodOptional<z.ZodString>;
    brandId: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodNumber>, z.ZodTransform<number[] | null, number[]>>>;
    categoryId: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodNumber>, z.ZodTransform<number[] | null, number[]>>>;
    sort: z.ZodOptional<z.ZodObject<{
        field: z.ZodOptional<z.ZodEnum<{
            name: "name";
            price: "price";
            status: "status";
            createdAt: "createdAt";
        }>>;
        direction: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, z.core.$strip>>;
    price: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    status: z.ZodOptional<z.ZodArray<z.ZodEnum<typeof ProductStatus>>>;
}, z.core.$strip>;
export type ProductsQuery = z.infer<typeof productsQuerySchema>;
declare const productSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    description: z.ZodOptional<z.ZodAny>;
    brandId: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    thumbnail: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<typeof ProductStatus>;
    createdAt: z.ZodDate;
    price: z.ZodNumber;
}, z.core.$strip>;
export type Product = z.infer<typeof productSchema>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    brandId: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    price: z.ZodNumber;
    status: z.ZodEnum<typeof ProductStatus>;
    description: z.ZodOptional<z.ZodAny>;
    thumbnail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    brandId: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    price: z.ZodNumber;
    status: z.ZodEnum<typeof ProductStatus>;
    description: z.ZodOptional<z.ZodAny>;
    thumbnail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export {};
