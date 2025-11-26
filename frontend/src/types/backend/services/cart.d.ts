import type z from "zod";
import { addToCartSchema, removeFromCartSchema, updateCartItemSchema } from "@/schemas/cart";
export declare function getCart(userId: string): Promise<{
    id: number;
    userId: string;
    price: string;
    variantId: number;
    quantity: number;
    variant: {
        id: number;
        name: string;
        image: string | null;
        createdAt: Date;
        status: "active" | "inactive";
        metadata: any;
        price: string;
        discount: string | null;
        productId: number | null;
        sku: string;
        stock: number;
        isDefault: boolean | null;
        product: {
            id: number;
            discount: string | null;
        } | null;
        variantValues: {
            variantId: number;
            attributeValueId: number;
            value: {
                id: number;
                value: string;
                metadata: unknown;
                attributeId: number;
            };
        }[];
    };
}[]>;
export declare function addToCart(userId: string, input: z.infer<typeof addToCartSchema>): Promise<{
    success: boolean;
}>;
export declare function removeFromCart(userId: string, input: z.infer<typeof removeFromCartSchema>): Promise<{
    success: boolean;
}>;
export declare function updateCartItem(userId: string, input: z.infer<typeof updateCartItemSchema>): Promise<{
    success: boolean;
}>;
export declare function clearCart(userId: string): Promise<{
    success: boolean;
}>;
export declare function countCartItems(userId: string): Promise<number>;
export declare function getCartItemsInIds(userId: string, cartItemIds: number[]): Promise<{
    id: number;
    userId: string;
    price: string;
    variantId: number;
    quantity: number;
    variant: {
        id: number;
        name: string;
        image: string | null;
        createdAt: Date;
        status: "active" | "inactive";
        metadata: any;
        price: string;
        discount: string | null;
        productId: number | null;
        sku: string;
        stock: number;
        isDefault: boolean | null;
        product: {
            id: number;
            discount: string | null;
        } | null;
        variantValues: {
            variantId: number;
            attributeValueId: number;
            value: {
                id: number;
                value: string;
                metadata: unknown;
                attributeId: number;
            };
        }[];
    };
}[]>;
