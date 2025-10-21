import { type inferProcedureOutput } from "@trpc/server";
declare const cartRoute: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        session: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        } | null;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getCart: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
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
                metadata: any;
                status: "active" | "inactive";
                price: string;
                productId: number | null;
                sku: string;
                stock: number;
                isDefault: boolean | null;
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
        }[];
        meta: object;
    }>;
    addToCart: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            quantity: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    removeFromCart: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            cartItemId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    updateCartItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            cartItemId: number;
            quantity: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    clearCart: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    countCartItems: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: number;
        meta: object;
    }>;
}>>;
export default cartRoute;
export type GetCartResponse = inferProcedureOutput<typeof cartRoute.getCart>;
