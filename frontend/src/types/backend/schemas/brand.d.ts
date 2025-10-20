import z from "zod";
export declare const querySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodDefault<z.ZodString>>;
}, z.core.$strip>;
export type QuerySchema = z.infer<typeof querySchema>;
export declare const createBrandSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    logo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateBrandSchema = z.infer<typeof createBrandSchema>;
export declare const updateBrandSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    logo: z.ZodOptional<z.ZodString>;
    id: z.ZodNumber;
}, z.core.$strip>;
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;
