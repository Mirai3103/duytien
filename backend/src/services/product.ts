import db from "@/db";
import type z from "zod";
import {
  createProductSchema,
  productsQuerySchema,
  ProductStatus,
  updateProductSchema,
} from "@/schemas/product";
import { categories, products, productVariants } from "@/db/schema";
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  exists,
  gte,
  ilike,
  inArray,
} from "drizzle-orm";

export async function getProducts(input: z.infer<typeof productsQuerySchema>) {
  const timeStart = performance.now();
  const res = await db.query.products.findMany({
    limit: input.limit,
    offset: (input.page - 1) * input.limit,
    with: {
      brand: true,
      category: true,
    },
    where(fields, operators) {
      const conditions = [];
      if (input.keyword) {
        conditions.push(ilike(fields.name, `%${input.keyword}%`));
      }
      if (input.brandId) {
        conditions.push(inArray(fields.brandId, input.brandId));
      }
      if (input.categoryId) {
        conditions.push(inArray(fields.categoryId, input.categoryId));
      }
      if (input.status) {
        conditions.push(inArray(fields.status, input.status));
      }
      if (input.price) {
        conditions.push(
          between(
            fields.price,
            input.price.min?.toString() ?? "0",
            input.price.max?.toString() ?? "100000000"
          )
        );
      }
      if (conditions.length > 0) {
        return and(...conditions);
      }
      return undefined;
    },
    orderBy(fields, operators) {
      if (input.sort) {
        const { field, direction } = input.sort;
        if (field === "price") {
          return direction === "asc" ? asc(fields.price) : desc(fields.price);
        }
        if (field === "name") {
          return direction === "asc" ? asc(fields.name) : desc(fields.name);
        }
        if (field === "status") {
          return direction === "asc"
            ? asc(fields.status)
            : desc(fields.status);
        }
        if (field === "createdAt") {
          return direction === "asc"
            ? asc(fields.createdAt)
            : desc(fields.createdAt);
        }
      }
      return [asc(fields.createdAt)];
    },
  });
  const timeEnd = performance.now();
  console.log(`Time taken: ${timeEnd - timeStart} milliseconds`);
  console.log(`Total products: ${res.length}`);
  return res;
}

export async function countProducts(input: z.infer<typeof productsQuerySchema>) {
  const conditions = [
    exists(
      db
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.productId, products.id))
    ),
  ];
  if (input.keyword) {
    conditions.push(ilike(products.name, `%${input.keyword}%`));
  }
  if (input.brandId) {
    conditions.push(inArray(products.brandId, input.brandId));
  }
  if (input.categoryId) {
    conditions.push(inArray(products.categoryId, input.categoryId));
  }
  if (input.status) {
    conditions.push(inArray(products.status, input.status));
  }
  if (input.price) {
    conditions.push(
      between(
        products.price,
        input.price.min?.toString() ?? "0",
        input.price.max?.toString() ?? "100000000"
      )
    );
  }
  try {
    return await db
      .select({ count: count() })
      .from(products)
      .where(and(...conditions));
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function getProductsWithVariants(
  input: z.infer<typeof productsQuerySchema>
) {
  const timeStart = performance.now();
  const res = await db.query.products.findMany({
    limit: input.limit,
    offset: (input.page - 1) * input.limit,
    columns: {
      description: false,
      metadata: false,
    },
    where(fields, operators) {
      console.log({ input });
      const conditions = [
        exists(
          db
            .select({ id: productVariants.id })
            .from(productVariants)
            .where(eq(productVariants.productId, fields.id))
        ),
      ];
      if (input.keyword) {
        conditions.push(ilike(fields.name, `%${input.keyword}%`));
      }
      if (input.brandId && input.brandId.length > 0) {
        conditions.push(inArray(fields.brandId, input.brandId));
      }
      if (input.categoryId && input.categoryId.length > 0) {
        conditions.push(inArray(fields.categoryId, input.categoryId));
      }
      if (input.status && input.status.length > 0) {
        conditions.push(inArray(fields.status, input.status));
      }
      if (input.price) {
        conditions.push(
          between(
            fields.price,
            input.price.min?.toString() ?? "0",
            input.price.max?.toString() ?? "100000000"
          )
        );
      }
      console.log(conditions.length);
      if (conditions.length > 0) {
        return and(...conditions);
      }
      return undefined;
    },
    with: {
      brand: true,
      category: true,
    },
    orderBy(fields, operators) {
      const field =
        fields[input.sort?.field as keyof typeof fields] || fields.createdAt;
      if (input.sort?.direction === "asc") {
        return asc(field);
      }
      return desc(field);
    },
  });
  const timeEnd = performance.now();
  console.log(`Time taken: ${timeEnd - timeStart} milliseconds`);
  return res;
}

export async function getProductDetail(productId: number) {
  return await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: {
      variantsAggregate: false,
    },
    with: {
      brand: true,
      category: true,
      variants: {
        with: {
          variantValues: {
            with: {
              value: {
                with: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
      specs: {
        with: {
          value: {
            with: {
              key: {
                with: {
                  group: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function createProduct(
  input: z.infer<typeof createProductSchema>
) {
  await db.insert(products).values({
    ...input,
    price: input.price.toString(),
    createdAt: new Date(),
  });
  return { success: true };
}

export async function updateProduct(
  input: z.infer<typeof updateProductSchema>
) {
  const { id, ...rest } = input;
  await db
    .update(products)
    .set({
      ...rest,
      price: input.price.toString(),
    })
    .where(eq(products.id, id));
  return { success: true };
}

export async function deleteProduct(productId: number) {
  await db.delete(products).where(eq(products.id, productId));
  return { success: true };
}

export async function toggleProductStatus(productId: number) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product) {
    throw new Error("Product not found");
  }
  await db
    .update(products)
    .set({
      status:
        product.status === ProductStatus.ACTIVE
          ? ProductStatus.INACTIVE
          : ProductStatus.ACTIVE,
    })
    .where(eq(products.id, productId));
  return { success: true };
}

export async function getProductsByCategoryId(input: {
  categoryId: number;
  limit: number;
  offset: number;
}) {
  return await db.query.products.findMany({
    where: eq(products.categoryId, input.categoryId),
    limit: input.limit,
    offset: input.offset,
    columns: {
      variantsAggregate: false,
      metadata: false,
      description: false,
    },
    with: {
      brand: true,
      category: true,
    },
  });
}

export async function getFeaturedProducts(input: {
  limit: number;
  offset: number;
  categoryId?: number;
}) {
  let categoryIds: number[] = [];
  if (input.categoryId) {
    categoryIds.push(input.categoryId);
    // find all child categories
    const childCategories = await db.query.categories.findMany({
      where: eq(categories.parentId, input.categoryId),
      columns: {
        id: true,
      },
    });
    categoryIds.push(...childCategories.map((category) => category.id));
  }
  return await db.query.products.findMany({
    where(fields, operators) {
      const conditions = [eq(fields.isFeatured, true)];
      if (categoryIds.length > 0) {
        conditions.push(inArray(fields.categoryId, categoryIds));
      }
      return and(...conditions);
    },
    columns: {
      variantsAggregate: false,
      metadata: false,
      description: false,
    },
    limit: input.limit,
    offset: input.offset,
  });
}

export async function setDiscount(input: {
  productId: number;
  discount: number;
}) {
  await db
    .update(products)
    .set({ discount: input.discount.toString() })
    .where(eq(products.id, input.productId));
  return { success: true };
}

export async function getFlashSaleProducts(input: {
  limit: number;
  offset: number;
}) {
  return await db.query.products.findMany({
    where: gte(products.discount, "0"),
    limit: input.limit,
    offset: input.offset,
    columns: {
      description: false,
      metadata: false,
      variantsAggregate: false,
    },
    orderBy: desc(products.discount),
  });
}