import { eq, sql } from "drizzle-orm";
import db from "..";
import { products as productsTable } from "../schema";
import puppeteer from "puppeteer";

const products = await db.query.products.findMany({
  where: sql`NOT (${productsTable.metadata} ? 'isProcessDetail')`,
});

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for await (const product of products) {
  const fptUrl = `https://fptshop.com.vn/${product.metadata.slug}`;
  const page = await browser.newPage();

  console.log("🔗 Đang mở:", fptUrl);
  await page.goto(fptUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Nhấn nút “Xem cấu hình chi tiết” nếu có
  await page.waitForSelector(
    "#ThongTinSanPham  div.flex.items-center.justify-between > button > span",
    {
      timeout: 20000,
    }
  );
  const btn = await page.$(
    "#ThongTinSanPham  div.flex.items-center.justify-between > button > span"
  );
  if (btn) {
    console.log("🖱️  Click 'Xem cấu hình chi tiết'...");
    await btn.click();
    await page.waitForSelector("#drawer-container-body div.px-5.pb-15", {
      timeout: 10000,
    });
  }

  // 🔍 Lấy mô tả sản phẩm
  const description = await page
    .$eval(
      ".ProductContent_description-container__miT3z",
      (el) => el.textContent?.trim() || ""
    )
    .catch(() => "");
  await page.waitForSelector(
    "#drawer-container-body > div.px-5.pb-15 .tab-content",
    {
      timeout: 10000,
    }
  );
  // 🔍 Lấy bảng thông số
  const groups = await page
    .$$eval("#drawer-container-body > div.px-5.pb-15 .tab-content", (els) => {
      const data: any[] = [];

      for (const el of els) {
        const groupName = el
          .querySelector(".b2-semibold span")
          ?.textContent?.trim();
        if (!groupName) continue;

        const specs: { key: string; value: string | string[] }[] = [];
        const rows = el.querySelectorAll(".border-b");

        for (const row of rows) {
          const key = row
            .querySelector("div.w-2\\/5 span")
            ?.textContent?.trim();
          if (!key) continue;

          const pTags = row.querySelectorAll(".flex-1 p");
          let value: string | string[] | undefined;

          if (pTags.length > 1) {
            value = Array.from(pTags)
              .map((p) => p.textContent?.trim())
              .filter(Boolean) as string[];
          } else if (pTags.length === 1) {
            value = pTags[0].textContent?.trim() || "";
          } else {
            const text = row.querySelector(".flex-1")?.textContent || "";
            value = text.replace(/\s+/g, " ").trim();
          }

          specs.push({ key, value });
        }

        if (specs.length) data.push({ group_name: groupName, specs });
      }

      return data;
    })
    .catch(() => []);
  if (groups.length === 0) {
    console.log("No groups found");
    continue;
  }
  console.log(JSON.stringify(groups, null, 2));

  await page.close();
  await db
    .update(productsTable)
    .set({
      metadata: { ...product.metadata, specs: groups, isProcessDetail: true },
      description,
    })
    .where(eq(productsTable.id, product.id));
}

await browser.close();
console.log("✅ Done");
