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
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                metadata: any;
                description: string | null;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
                variantsAggregate: {
                    id: number;
                    name: string;
                    image: string | null;
                    createdAt: Date;
                    status: "active" | "inactive";
                    metadata: any;
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
                }[] | null;
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
            output: 0 | {
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
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
                variantsAggregate: {
                    id: number;
                    name: string;
                    image: string | null;
                    createdAt: Date;
                    status: "active" | "inactive";
                    metadata: any;
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
                }[] | null;
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
        getProductDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: number;
            output: {
                id: number;
                name: string;
                createdAt: Date;
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                metadata: any;
                description: string | null;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
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
                    status: "active" | "inactive";
                    metadata: any;
                    price: string;
                    discount: string | null;
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
                specs: {
                    isFeatured: boolean;
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
            } | undefined;
            meta: object;
        }>;
        createProduct: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                status: import("../schemas/product").ProductStatus;
                slug: string;
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
                status: import("../schemas/product").ProductStatus;
                slug: string;
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
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
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
        getFeaturedProducts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
                offset?: number | undefined;
                categoryId?: number | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
            }[];
            meta: object;
        }>;
        setDiscount: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                discount: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getFlashSaleProducts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
                offset?: number | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                status: "active" | "inactive";
                slug: string;
                isFeatured: boolean;
                brandId: number | null;
                categoryId: number | null;
                thumbnail: string | null;
                price: string;
                discount: string | null;
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
                discount: string | null;
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
                status: "active" | "inactive";
                metadata: any;
                price: string;
                discount: string | null;
                productId: number | null;
                sku: string;
                stock: number;
                isDefault: boolean | null;
                specs: {
                    isFeatured: boolean;
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
                status: "active" | "inactive";
                metadata: any;
                price: string;
                discount: string | null;
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
        getFeatured: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: number;
                name: string;
                slug: string;
                logo: string | null;
                isFeatured: boolean;
            }[];
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
        toggleFeaturedProductSpec: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productId: number;
                specValueId: number;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        toggleFeaturedProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
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
                isFeatured: boolean;
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
                isFeatured: boolean;
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
        searchUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                emailVerified?: boolean | undefined;
                dateRange?: {
                    from?: Date | undefined;
                    to?: Date | undefined;
                } | null | undefined;
                orderBy?: "name" | "createdAt" | undefined;
                orderDirection?: "asc" | "desc" | undefined;
            };
            output: {
                users: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    image: string | null;
                    emailVerified: boolean;
                    createdAt: Date;
                    totalOrders: number;
                    totalAmount: string;
                    status: string;
                    role: string;
                }[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getMyProfile: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                phone: string | null;
                gender: string | null;
                dateOfBirth: Date | null;
                image: string | null;
                createdAt: Date;
                role: string;
                updatedAt: Date;
            } | undefined;
            meta: object;
        }>;
        updateMyProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name?: string | undefined;
                phone?: string | undefined;
                gender?: "other" | "male" | "female" | undefined;
                dateOfBirth?: string | undefined;
                avatar?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getUserById: import("@trpc/server").TRPCQueryProcedure<{
            input: string;
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                phone: string | null;
                gender: string | null;
                dateOfBirth: Date | null;
                image: string | null;
                createdAt: Date;
                totalOrders: number;
                totalAmount: string;
                status: string;
                role: string;
                updatedAt: Date;
            } | undefined;
            meta: object;
        }>;
        verifyEmailById: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("pg").QueryResult<never>;
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
        getCartItemsInIds: import("@trpc/server").TRPCQueryProcedure<{
            input: number[];
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
            }[];
            meta: object;
        }>;
    }>>;
    addresses: import("@trpc/server").TRPCBuiltRouter<{
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
            output: import("./routes/address.route").Province[];
            meta: object;
        }>;
        getWards: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                provinceCode: string;
            };
            output: import("./routes/address.route").Commune[];
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
    orders: import("@trpc/server").TRPCBuiltRouter<{
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
        createOrder: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                cartItems: number[];
                shippingAddressId: number;
                paymentMethod: "cod" | "vnpay" | "momo";
                note?: string | undefined;
                voucherId?: number | undefined;
                installmentCount?: number | undefined;
                payType?: "full" | "partial" | undefined;
                identityId?: string | undefined;
                fullName?: string | undefined;
            };
            output: {
                success: boolean;
                message: string;
                redirectUrl: string;
            };
            meta: object;
        }>;
        getOrders: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                orders: {
                    id: number;
                    createdAt: Date;
                    totalAmount: string;
                    status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                    userId: string;
                    code: string;
                    paymentMethod: "cod" | "vnpay" | "momo";
                    payType: "full" | "partial";
                    deliveryAddressId: number | null;
                    voucherId: number | null;
                    totalItems: number;
                    lastPaymentId: number | null;
                    note: string | null;
                    identityId: string | null;
                    full_name: string | null;
                    nextPayDay: Date | null;
                    nextPayAmount: string | null;
                    installmentCount: number | null;
                    remainingInstallments: number | null;
                    totalPaidAmount: string | null;
                    voucher: {
                        id: number;
                        name: string;
                        createdAt: Date;
                        discount: string;
                        code: string;
                        type: "fixed" | "percentage";
                        maxDiscount: string | null;
                        minOrderAmount: string | null;
                        maxOrderAmount: string | null;
                        maxUsage: number | null;
                        isActive: boolean;
                        usageCount: number;
                    } | null;
                    items: {
                        price: string;
                        variantId: number;
                        quantity: number;
                        orderId: number;
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
                                name: string;
                                createdAt: Date;
                                status: "active" | "inactive";
                                slug: string;
                                isFeatured: boolean;
                                metadata: any;
                                description: string | null;
                                brandId: number | null;
                                categoryId: number | null;
                                thumbnail: string | null;
                                price: string;
                                discount: string | null;
                                variantsAggregate: {
                                    id: number;
                                    name: string;
                                    image: string | null;
                                    createdAt: Date;
                                    status: "active" | "inactive";
                                    metadata: any;
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
                                }[] | null;
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
                    }[];
                    lastPayment: {
                        id: number;
                        createdAt: Date;
                        status: "pending" | "success" | "failed";
                        orderId: number;
                        amount: string;
                        method: string | null;
                        paymentDate: Date | null;
                    } | null;
                    deliveryAddress: {
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
                    } | null;
                }[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getStatusStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                statusStats: {
                    status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                    count: number;
                }[];
                totalOrders: number;
            };
            meta: object;
        }>;
        searchOrders: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                status?: ("pending" | "shipping" | "delivered" | "cancelled")[] | undefined;
                paymentMethod?: "cod" | "vnpay" | "momo" | "all" | undefined;
                paymentStatus?: "pending" | "success" | "failed" | undefined;
                dateRange?: {
                    from?: Date | undefined;
                    to?: Date | undefined;
                } | null | undefined;
                orderBy?: "createdAt" | "totalAmount" | undefined;
                orderDirection?: "asc" | "desc" | undefined;
            };
            output: {
                orders: {
                    vouchers: {
                        id: number;
                        name: string;
                        code: string;
                        type: "fixed" | "percentage";
                        discount: string;
                        maxDiscount: string | null;
                        minOrderAmount: string | null;
                        maxOrderAmount: string | null;
                        maxUsage: number | null;
                        isActive: boolean;
                        usageCount: number;
                        createdAt: Date;
                    } | null;
                    payments: {
                        id: number;
                        orderId: number;
                        amount: string;
                        method: string | null;
                        status: "pending" | "success" | "failed";
                        paymentDate: Date | null;
                        createdAt: Date;
                    } | null;
                    orders: {
                        id: number;
                        code: string;
                        userId: string;
                        status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                        totalAmount: string;
                        paymentMethod: "cod" | "vnpay" | "momo";
                        payType: "full" | "partial";
                        deliveryAddressId: number | null;
                        createdAt: Date;
                        voucherId: number | null;
                        totalItems: number;
                        lastPaymentId: number | null;
                        note: string | null;
                        identityId: string | null;
                        full_name: string | null;
                        nextPayDay: Date | null;
                        nextPayAmount: string | null;
                        installmentCount: number | null;
                        remainingInstallments: number | null;
                        totalPaidAmount: string | null;
                    };
                    u_table: {
                        id: string;
                        name: string;
                        email: string;
                        emailVerified: boolean;
                        phone: string | null;
                        gender: string | null;
                        dateOfBirth: Date | null;
                        image: string | null;
                        createdAt: Date;
                        totalOrders: number;
                        totalAmount: string;
                        status: string;
                        role: string;
                        updatedAt: Date;
                    } | null;
                }[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getOrder: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: number;
            };
            output: {
                id: number;
                createdAt: Date;
                totalAmount: string;
                status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                userId: string;
                code: string;
                paymentMethod: "cod" | "vnpay" | "momo";
                payType: "full" | "partial";
                deliveryAddressId: number | null;
                voucherId: number | null;
                totalItems: number;
                lastPaymentId: number | null;
                note: string | null;
                identityId: string | null;
                full_name: string | null;
                nextPayDay: Date | null;
                nextPayAmount: string | null;
                installmentCount: number | null;
                remainingInstallments: number | null;
                totalPaidAmount: string | null;
                user: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    phone: string | null;
                    gender: string | null;
                    dateOfBirth: Date | null;
                    image: string | null;
                    createdAt: Date;
                    totalOrders: number;
                    totalAmount: string;
                    status: string;
                    role: string;
                    updatedAt: Date;
                };
                voucher: {
                    id: number;
                    name: string;
                    createdAt: Date;
                    discount: string;
                    code: string;
                    type: "fixed" | "percentage";
                    maxDiscount: string | null;
                    minOrderAmount: string | null;
                    maxOrderAmount: string | null;
                    maxUsage: number | null;
                    isActive: boolean;
                    usageCount: number;
                } | null;
                items: {
                    price: string;
                    variantId: number;
                    quantity: number;
                    orderId: number;
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
                            name: string;
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
                }[];
                lastPayment: {
                    id: number;
                    createdAt: Date;
                    status: "pending" | "success" | "failed";
                    orderId: number;
                    amount: string;
                    method: string | null;
                    paymentDate: Date | null;
                } | null;
            } | undefined;
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
                status: "pending" | "shipping" | "delivered" | "cancelled";
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        cancelOrder: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
    }>>;
    vouchers: import("@trpc/server").TRPCBuiltRouter<{
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
        getVouchers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                keyword?: string | undefined;
                orderBy?: "createdAt" | "usageCount" | undefined;
                orderDirection?: "asc" | "desc" | undefined;
                type?: "fixed" | "percentage" | undefined;
            };
            output: {
                vouchers: {
                    id: number;
                    name: string;
                    createdAt: Date;
                    discount: string;
                    code: string;
                    type: "fixed" | "percentage";
                    maxDiscount: string | null;
                    minOrderAmount: string | null;
                    maxOrderAmount: string | null;
                    maxUsage: number | null;
                    isActive: boolean;
                    usageCount: number;
                }[];
                total: number;
            };
            meta: object;
        }>;
        checkVoucherCode: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                code: string;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                discount: string;
                code: string;
                type: "fixed" | "percentage";
                maxDiscount: string | null;
                minOrderAmount: string | null;
                maxOrderAmount: string | null;
                maxUsage: number | null;
                isActive: boolean;
                usageCount: number;
            } | undefined;
            meta: object;
        }>;
        toggleVoucherStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        createVoucher: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                code: string;
                name: string;
                type: "fixed" | "percentage";
                discount: number;
                maxDiscount?: number | undefined;
                minOrderAmount?: number | undefined;
                maxOrderAmount?: number | undefined;
                maxUsage?: number | undefined;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                discount: string;
                code: string;
                type: "fixed" | "percentage";
                maxDiscount: string | null;
                minOrderAmount: string | null;
                maxOrderAmount: string | null;
                maxUsage: number | null;
                isActive: boolean;
                usageCount: number;
            } | undefined;
            meta: object;
        }>;
        updateVoucher: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
                code: string;
                name: string;
                type: "fixed" | "percentage";
                discount: number;
                maxDiscount?: number | undefined;
                minOrderAmount?: number | undefined;
                maxOrderAmount?: number | undefined;
                maxUsage?: number | undefined;
            };
            output: {
                id: number;
                name: string;
                code: string;
                type: "fixed" | "percentage";
                discount: string;
                maxDiscount: string | null;
                minOrderAmount: string | null;
                maxOrderAmount: string | null;
                maxUsage: number | null;
                isActive: boolean;
                usageCount: number;
                createdAt: Date;
            } | undefined;
            meta: object;
        }>;
        deleteVoucher: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        checkCanUseVoucher: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                voucherCode: string;
                orderAmount: number;
            };
            output: {
                valid: boolean;
                message: string;
                reducePrice?: number;
                voucher?: {
                    id: number;
                    name: string;
                    discount: string;
                    type: "percentage" | "fixed";
                    maxDiscount: string | null;
                    minOrderAmount: string | null;
                    maxOrderAmount: string | null;
                    maxUsage: number | null;
                    isActive: boolean;
                    code: string;
                } | undefined;
            };
            meta: object;
        }>;
        getVoucherByCode: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                code: string;
            };
            output: {
                id: number;
                name: string;
                createdAt: Date;
                discount: string;
                code: string;
                type: "fixed" | "percentage";
                maxDiscount: string | null;
                minOrderAmount: string | null;
                maxOrderAmount: string | null;
                maxUsage: number | null;
                isActive: boolean;
                usageCount: number;
            } | undefined;
            meta: object;
        }>;
    }>>;
    payment: import("@trpc/server").TRPCBuiltRouter<{
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
        callback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                momo?: any;
                vnpay?: any;
            };
            output: {
                success: boolean;
                message: string;
                payment: null;
                isPaymentSuccess?: undefined;
            } | {
                success: boolean;
                isPaymentSuccess: boolean;
                message: string;
                payment: {
                    id: number;
                    createdAt: Date;
                    status: "pending" | "success" | "failed";
                    orderId: number;
                    amount: string;
                    method: string | null;
                    paymentDate: Date | null;
                    order: {
                        id: number;
                        createdAt: Date;
                        totalAmount: string;
                        status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                        userId: string;
                        code: string;
                        paymentMethod: "cod" | "vnpay" | "momo";
                        payType: "full" | "partial";
                        deliveryAddressId: number | null;
                        voucherId: number | null;
                        totalItems: number;
                        lastPaymentId: number | null;
                        note: string | null;
                        identityId: string | null;
                        full_name: string | null;
                        nextPayDay: Date | null;
                        nextPayAmount: string | null;
                        installmentCount: number | null;
                        remainingInstallments: number | null;
                        totalPaidAmount: string | null;
                    };
                };
            };
            meta: object;
        }>;
        createPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orderId: string;
            };
            output: {
                success: boolean;
                message: string;
                payment: null;
                redirectUrl?: undefined;
            } | {
                success: boolean;
                message: string;
                redirectUrl: string;
                payment?: undefined;
            };
            meta: object;
        }>;
        setOrderPaymentStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orderId: number;
                status: "pending" | "success" | "failed";
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        createInstallmentPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orderId: number;
            };
            output: {
                success: boolean;
                message: string;
                redirectUrl: string;
            };
            meta: object;
        }>;
    }>>;
    review: import("@trpc/server").TRPCBuiltRouter<{
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
    dashboard: import("@trpc/server").TRPCBuiltRouter<{
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
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                totalRevenue: number;
                revenueChange: number;
                totalOrders: number;
                ordersChange: number;
                totalProducts: number;
                productsChange: number;
                totalCustomers: number;
                customersChange: number;
            };
            meta: object;
        }>;
        getRevenueByMonth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                month: string;
                revenue: number;
            }[];
            meta: object;
        }>;
        getRevenueByDay: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                day: string;
                revenue: number;
            }[];
            meta: object;
        }>;
        getOrdersByWeek: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                day: string;
                orders: number;
            }[];
            meta: object;
        }>;
        getRecentOrders: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                customer: string;
                product: string;
                amount: number;
                status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
            }[];
            meta: object;
        }>;
        getTopProducts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                sales: number;
                percentage: number;
            }[];
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
