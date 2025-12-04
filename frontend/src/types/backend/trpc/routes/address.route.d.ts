export interface Province {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    decree: string;
}
export interface Commune {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    provinceCode: string;
    provinceName: string;
    decree: string;
}
declare const addressRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getProvinces: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: Province[];
        meta: object;
    }>;
    getWards: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            provinceCode: string;
        };
        output: Commune[];
        meta: object;
    }>;
    getAddresses: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: number;
            phone: string;
            userId: string | null;
            isDefault: boolean;
            note: string | null;
            detail: string;
            ward: string;
            province: string;
            fullName: string;
            isHidden: boolean;
        }[];
        meta: object;
    }>;
    setDefaultAddress: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    createAddress: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            phone: string;
            ward: string;
            province: string;
            detail: string;
            fullName: string;
            note: string;
            isDefault: boolean;
            isHidden?: boolean | undefined;
        };
        output: number;
        meta: object;
    }>;
    deleteAddress: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    updateAddress: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            phone?: string | undefined;
            ward?: string | undefined;
            province?: string | undefined;
            detail?: string | undefined;
            fullName?: string | undefined;
            note?: string | undefined;
            isDefault?: boolean | undefined;
            isHidden?: boolean | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
export { addressRoute };
