export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    products: import("@trpc/server").TRPCBuiltRouter<{
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
        getProducts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                keyword?: string | undefined;
                brandId?: number[] | undefined;
                categoryId?: number[] | undefined;
                sort?: {
                    field?: "name" | "createdAt" | "status" | "price" | undefined;
                    direction?: "asc" | "desc" | undefined;
                } | undefined;
                price?: {
                    min?: number | undefined;
                    max?: number | undefined;
                } | undefined;
                status?: import("../schemas/product").ProductStatus[] | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                isFeatured: boolean;
                metadata: any;
                description: string | null;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                status: "active" | "inactive";
                price: string;
                brand: {
                    id: number;
                    name: string;
                    slug: string;
                    logo: string | null;
                    isFeatured: boolean;
                } | null;
                category: {
                    id: number;
                    name: string;
                    slug: string;
                    parentId: number | null;
                    metadata: {
                        image?: string;
                        totalProduct?: number;
                        totalChild?: number;
                    } | null;
                } | null;
            }[];
            meta: object;
        }>;
        countProducts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                keyword?: string | undefined;
                brandId?: number[] | undefined;
                categoryId?: number[] | undefined;
                sort?: {
                    field?: "name" | "createdAt" | "status" | "price" | undefined;
                    direction?: "asc" | "desc" | undefined;
                } | undefined;
                price?: {
                    min?: number | undefined;
                    max?: number | undefined;
                } | undefined;
                status?: import("../schemas/product").ProductStatus[] | undefined;
            };
            output: {
                count: number;
            }[];
            meta: object;
        }>;
        getProductsWithVariants: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                keyword?: string | undefined;
                brandId?: number[] | undefined;
                categoryId?: number[] | undefined;
                sort?: {
                    field?: "name" | "createdAt" | "status" | "price" | undefined;
                    direction?: "asc" | "desc" | undefined;
                } | undefined;
                price?: {
                    min?: number | undefined;
                    max?: number | undefined;
                } | undefined;
                status?: import("../schemas/product").ProductStatus[] | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                isFeatured: boolean;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                status: "active" | "inactive";
                price: string;
                brand: {
                    id: number;
                    name: string;
                    slug: string;
                    logo: string | null;
                    isFeatured: boolean;
                } | null;
                category: {
                    id: number;
                    name: string;
                    slug: string;
                    parentId: number | null;
                    metadata: {
                        image?: string;
                        totalProduct?: number;
                        totalChild?: number;
                    } | null;
                } | null;
                variants: {
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
                            attribute: {
                                id: number;
                                name: string;
                            };
                        };
                    }[];
                }[];
            }[];
            meta: object;
        }>;
        getProductDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                isFeatured: boolean;
                metadata: any;
                description: string | null;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                status: "active" | "inactive";
                price: string;
                brand: {
                    id: number;
                    name: string;
                    slug: string;
                    logo: string | null;
                    isFeatured: boolean;
                } | null;
                category: {
                    id: number;
                    name: string;
                    slug: string;
                    parentId: number | null;
                    metadata: {
                        image?: string;
                        totalProduct?: number;
                        totalChild?: number;
                    } | null;
                } | null;
                variants: {
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
                            attribute: {
                                id: number;
                                name: string;
                            };
                        };
                    }[];
                }[];
            } | undefined;
            meta: object;
        }>;
        createProduct: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                slug: string;
                status: import("../schemas/product").ProductStatus;
                price: number;
                description?: any;
                brandId?: number | undefined;
                categoryId?: number | undefined;
                thumbnail?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updateProduct: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
                name: string;
                slug: string;
                status: import("../schemas/product").ProductStatus;
                price: number;
                description?: any;
                brandId?: number | undefined;
                categoryId?: number | undefined;
                thumbnail?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        deleteProduct: import("@trpc/server").TRPCMutationProcedure<{
            input: number;
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        toggleProductStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: number;
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getProductsByCategoryId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                categoryId: number;
                limit?: number | undefined;
                offset?: number | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                isFeatured: boolean;
                metadata: any;
                description: string | null;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                status: "active" | "inactive";
                price: string;
                brand: {
                    id: number;
                    name: string;
                    slug: string;
                    logo: string | null;
                    isFeatured: boolean;
                } | null;
                category: {
                    id: number;
                    name: string;
                    slug: string;
                    parentId: number | null;
                    metadata: {
                        image?: string;
                        totalProduct?: number;
                        totalChild?: number;
                    } | null;
                } | null;
            }[];
            meta: object;
        }>;
    }>>;
    variants: import("@trpc/server").TRPCBuiltRouter<{
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
        getVariants: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                name: string;
                image: string | null;
                createdAt: Date;
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
                        attribute: {
                            id: number;
                            name: string;
                        };
                    };
                }[];
            }[];
            meta: object;
        }>;
        getVariantDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
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
                specs: {
                    variantId: number;
                    specValueId: number;
                    value: {
                        id: number;
                        value: string;
                        keyId: number;
                        key: {
                            id: number;
                            name: string;
                            groupId: number;
                            group: {
                                id: number;
                                name: string;
                            };
                        };
                    };
                }[];
                variantValues: {
                    variantId: number;
                    attributeValueId: number;
                    value: {
                        id: number;
                        value: string;
                        metadata: unknown;
                        attributeId: number;
                        attribute: {
                            id: number;
                            name: string;
                        };
                    };
                }[];
                images: {
                    id: number;
                    image: string;
                    variantId: number;
                }[];
            } | undefined;
            meta: object;
        }>;
        getDefaultVariantDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
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
            } | undefined;
            meta: object;
        }>;
        createVariant: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                image: string;
                status: import("../schemas/variant").VariantStatus;
                price: unknown;
                productId: number;
                sku: string;
                stock: unknown;
                isDefault: boolean;
                attributeValues: {
                    attributeId: number;
                    value: string;
                }[];
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updateVariant: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
                name: string;
                image: string;
                status: import("../schemas/variant").VariantStatus;
                price: unknown;
                productId: number;
                sku: string;
                stock: unknown;
                isDefault: boolean;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        setVariantAttributes: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                attributeValues: {
                    attributeId: number;
                    value: string;
                }[];
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        deleteVariant: import("@trpc/server").TRPCMutationProcedure<{
            input: number;
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        setDefaultVariant: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                variantId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        toggleVariantStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addStock: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                stock: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        setPrice: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                price: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    variantImages: import("@trpc/server").TRPCBuiltRouter<{
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
        editVariantImages: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                newImages: string[];
                deletedImages: number[];
            };
            output: string[];
            meta: object;
        }>;
    }>>;
    categories: import("@trpc/server").TRPCBuiltRouter<{
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
        getAllParentCategories: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
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
            }[];
            meta: object;
        }>;
        getByParentId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                parentId: string;
            };
            output: {
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
            }[];
            meta: object;
        }>;
        getAllParents: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                categoryId: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                slug: string;
                parentId: number | null;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                slug: string;
                parentId: number | null;
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    brands: import("@trpc/server").TRPCBuiltRouter<{
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
        getAll: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
            };
            output: {
                id: number;
                name: string;
                slug: string;
                logo: string | null;
                isFeatured: boolean;
            }[];
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                slug: string;
                logo?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                slug: string;
                id: number;
                logo?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    attributes: import("@trpc/server").TRPCBuiltRouter<{
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
        getAllKeys: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: number;
                name: string;
            }[];
            meta: object;
        }>;
        createKey: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
            };
            output: {
                id: number;
                name: string;
            } | undefined;
            meta: object;
        }>;
        getKeyByProductId: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                productId: number;
                attributeId: number;
                defaultValue: string | null;
                attribute: {
                    id: number;
                    name: string;
                };
            }[];
            meta: object;
        }>;
        createProductRequiredAttribute: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                attribute: string;
                defaultValue: string;
            };
            output: {
                success: boolean;
                id: number;
            };
            meta: object;
        }>;
        deleteProductRequiredAttribute: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                attributeId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    specs: import("@trpc/server").TRPCBuiltRouter<{
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
        createSpecGroup: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
            };
            output: number;
            meta: object;
        }>;
        createProductSpec: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                groupId: number;
                key: string;
                value: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        createProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                groupId: number;
                key: string;
                value: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        removeProductSpec: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                specValueId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        removeProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                variantId: number;
                specValueId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getSpecGroups: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: number;
                name: string;
            }[];
            meta: object;
        }>;
        getSpecKeys: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                name: string;
                groupId: number;
            }[];
            meta: object;
        }>;
        getSpecKeysOfGroup: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                name: string;
                groupId: number;
            }[];
            meta: object;
        }>;
        getValidValueOfSpecKey: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                value: string;
                keyId: number;
            }[];
            meta: object;
        }>;
        getProductSpecs: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                productId: number;
                specValueId: number;
                value: {
                    id: number;
                    value: string;
                    keyId: number;
                    key: {
                        id: number;
                        name: string;
                        groupId: number;
                        group: {
                            id: number;
                            name: string;
                        };
                    };
                };
            }[];
            meta: object;
        }>;
        getProductVariantSpecs: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                variantId: number;
                specValueId: number;
                value: {
                    id: number;
                    value: string;
                    keyId: number;
                    key: {
                        id: number;
                        name: string;
                        groupId: number;
                        group: {
                            id: number;
                            name: string;
                        };
                    };
                };
            }[];
            meta: object;
        }>;
    }>>;
    users: import("@trpc/server").TRPCBuiltRouter<{
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
        getMyProfile: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
            meta: object;
        }>;
    }>>;
    cart: import("@trpc/server").TRPCBuiltRouter<{
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
}>>;
export type AppRouter = typeof appRouter;
