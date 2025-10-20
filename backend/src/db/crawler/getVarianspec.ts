import { eq, sql } from "drizzle-orm";
import db from "..";
import {
  productVariantImages,
  productVariants as productVariantsTable,
} from "../schema";
// import puppeteer from "puppeteer";

import PQueue from "p-queue";
import type { SpecResponse } from "./type";

const queue = new PQueue({ concurrency: 2 }); // 4 tabs song song
async function getSpec(slug: string) {
  console.log(
    `https://papi.fptshop.com.vn/gw/v1/public/bff-before-order/product/attribute?slug=${slug}`
  );
  const rest = await fetch(
    `https://papi.fptshop.com.vn/gw/v1/public/bff-before-order/product/attribute?slug=${slug}`,
    {
      headers: {
        accept: "application/json",
        "accept-language": "vi;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "order-channel": "1",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua": '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
      },
      referrer: "https://fptshop.com.vn/",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    }
  );
  const response = (await rest.json()) as Promise<SpecResponse>;
  return response;
}
async function crawlProduct(product: any) {
  // Randomize viewport slightly to avoid fingerprinting from consistent dimensions
  try {
    const response = await getSpec(product.metadata.slug);
    console.log(response);

    const groups = response.data.attributeItem;
    const image = response.data.image.primaryImage.url;
    const slideImages = response.data.image.slideImages.map(
      (image: any) => image.url
    );
    // Uncomment khi muốn lưu DB
    console.log(`${product.slug} ${product.id} ${product.metadata.slug}`);
    await db
      .update(productVariantsTable)
      .set({
        metadata: {
          ...product.metadata,
          specs: groups,
          image,
          slideImages,
          isProcessSpec: true,
        },
      })
      .where(eq(productVariantsTable.id, product.id));
    if (slideImages.length) {
      await db.insert(productVariantImages).values(
        slideImages.map((image: any) => ({
          image,
          variantId: product.id,
        }))
      );
    }
  } catch (err: any) {
    console.error(`❌ Lỗi khi crawl ${product.slug}:`, err.message);
  } finally {
  }
}

(async () => {
  const variants = await db.query.productVariants.findMany({
    where: sql`NOT (${productVariantsTable.metadata} ? 'isProcessSpec')`,
  });

  if (!variants.length) {
    console.log("🚫 Không có sản phẩm nào cần crawl");
    process.exit(0);
  }
  console.log(`total variants: ${variants.length}`);

  console.log(
    `🚀 Bắt đầu crawl ${variants.length} sản phẩm với concurrency = ${queue.concurrency}`
  );

  for (const product of variants) {
    queue.add(() => crawlProduct(product));
  }

  await queue.onIdle();

  console.log("✅ Hoàn tất tất cả sản phẩm!");
})();
