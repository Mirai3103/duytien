export declare const reviewRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getReviewsOfProduct: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            variantId: number;
            limit?: number | undefined;
            cursor?: number | undefined;
        };
        output: {
            reviews: {
                id: number;
                createdAt: Date;
                userId: string;
                variantId: number;
                rating: number;
                comment: string | null;
                user: {
                    id: string;
                    name: string;
                };
                variant: {
                    id: number;
                    name: string;
                    variantValues: {
                        variantId: number;
                        attributeValueId: number;
                    }[];
                };
            }[];
            nextCursor: number | undefined;
        };
        meta: object;
    }>;
    getProductReviewStats: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            productId: number;
        };
        output: {
            total5Stars: number;
            total4Stars: number;
            total3Stars: number;
            total2Stars: number;
            total1Stars: number;
            totalReviews: number;
            averageRating: number;
        };
        meta: object;
    }>;
    checkCanReview: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            productId: number;
        };
        output: false | number[];
        meta: object;
    }>;
    createReview: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            rating: number;
            comment: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    editReview: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            reviewId: number;
            rating: number;
            comment: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    deleteReview: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            reviewId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
