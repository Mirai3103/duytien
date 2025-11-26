import type z from "zod";
import { categoryCreate, categoryUpdate } from "@/schemas/category";
export declare function getAllParentCategories(): Promise<{
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    metadata: {
        image?: string;
        totalProduct?: number;
        totalChild?: number;
    } | null;
    children: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    }[];
}[]>;
export declare function getByParentId(input: {
    parentId: string;
}): Promise<{
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    metadata: {
        image?: string;
        totalProduct?: number;
        totalChild?: number;
    } | null;
    children: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    }[];
}[]>;
export declare function getAllParents(input: {
    categoryId: string;
}): Promise<any>;
export declare function createCategory(input: z.infer<typeof categoryCreate>): Promise<{
    success: boolean;
}>;
export declare function updateCategory(input: z.infer<typeof categoryUpdate>): Promise<{
    success: boolean;
}>;
export declare function deleteCategory(input: {
    id: string;
}): Promise<{
    success: boolean;
}>;
export declare function getAllCategories(): Promise<{
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    metadata: {
        image?: string;
        totalProduct?: number;
        totalChild?: number;
    } | null;
}[]>;
