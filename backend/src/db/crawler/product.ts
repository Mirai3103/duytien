import db from "..";
import type { FPTRPaginationResponse } from "./type";
import {
  products as productsTable,
  productVariants as productVariantsTable,
} from "../schema";
import slugify from "slugify";
import { upsertBrand, upsertCategory } from "./utils";
async function crawlProduct(page: number, limit: number) {
  const skipCount = (page - 1) * limit;
  return fetch(
    "https://papi.fptshop.com.vn/gw/v1/public/fulltext-search-service/category",
    {
      headers: {
        accept: "application/json",
        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "order-channel": "1",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua": '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
      },
      referrer: "https://fptshop.com.vn/",
      body: `{"skipCount":${skipCount},"maxResultCount":${limit},"sortMethod":"noi-bat","slug":"dien-thoai","categoryType":"category","location":{}}`,
      method: "POST",
      mode: "cors",
      credentials: "omit",
    }
  )
    .then((res) => res.json() as Promise<FPTRPaginationResponse>)
    .then((data) => data.items);
}
const startPage = 1;
const endPage = 5;
const limit = 16;

for (let page = startPage; page <= endPage; page++) {
  const products = await crawlProduct(page, limit);
  for await (const product of products) {
    const brandId = await upsertBrand(product.brand.name);
    const meta: any = {
      group: product.group?.name,
      groupCode: product.group?.code,
      slug: product.slug,
      code: product.code,
      originalPrice: product.originalPrice,
      currentPrice: product.currentPrice,
      discountPercentage: product.discountPercentage,
      endTimeDiscount: product.endTimeDiscount,
      brandId,
    };
    const name = product.name || product.displayName;
    const price = product.price;
    const image = product.image.src;
    const categoryId = await upsertCategory("Điện thoại");
    const productDb = await db.insert(productsTable).values({
      name,
      price: price.toString(),
      slug: slugify(name, { lower: true }),
      categoryId,
      brandId,
      metadata: meta,
      status: "active",
      createdAt: new Date(),
      thumbnail: image,
    }).returning();
    const skus = product.skus;
    for await (const sku of skus) {
      const skuDb = await db
        .insert(productVariantsTable)
        .values({
          price: sku.originalPrice.toString(),
          sku: slugify(sku.name, { lower: true }) + "-" + sku.sku,
          productId: productDb[0]!.id,
          createdAt: new Date(),
          stock: 0,
          name: sku.name,
          image: sku.image,
          isDefault: false,
          
          metadata: {
            variants: sku.variants,
            reducedPrice: sku.currentPrice,
            discountPercentage: sku.discountPercentage,
            endTimeDiscount: sku.endTimeDiscount,
            slug: sku.slug,
            id: sku.sku,
          },
        })
        .onConflictDoNothing();
    }
  }
}
