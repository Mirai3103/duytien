import z from "zod";
export declare const category: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    slug: z.ZodString;
    parentId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export type Category = z.infer<typeof category>;
export declare const categoryWithChildren: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    slug: z.ZodString;
    parentId: z.ZodNullable<z.ZodNumber>;
    children: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        slug: z.ZodString;
        parentId: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CategoryWithChildren = z.infer<typeof categoryWithChildren>;
export declare const categoryCreate: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    parentId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export type CategoryCreate = z.infer<typeof categoryCreate>;
export declare const categoryUpdate: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    parentId: z.ZodNullable<z.ZodNumber>;
    id: z.ZodString;
}, z.core.$strip>;
export type CategoryUpdate = z.infer<typeof categoryUpdate>;
