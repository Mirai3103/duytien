import { eq, sql } from "drizzle-orm";
import puppeteer from "puppeteer";
import db from "..";
import { products as productsTable } from "../schema";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const products = await db.query.products.findMany({
    where: sql`NOT (${productsTable.metadata} ? 'isProcessDetail')`,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for await (const product of products) {
      try {
        console.log("🆔 Product:", product.id);
        const fptUrl = `https://fptshop.com.vn/${product.metadata.slug}`;
        const page = await browser.newPage();

        console.log("🔗 Đang mở:", fptUrl);
        await page.goto(fptUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Nhấn nút “Xem cấu hình chi tiết” nếu có
        await page.waitForSelector(
          "#ThongTinSanPham  div.flex.items-center.justify-between > button > span",
          { timeout: 20000 }
        );
        const btn = await page.$(
          "#ThongTinSanPham  div.flex.items-center.justify-between > button > span"
        );
        if (btn) {
          console.log("🖱️ Click 'Xem cấu hình chi tiết'...");
          await btn.click();
          await page.waitForSelector("#drawer-container-body div.px-5.pb-15", {
            timeout: 10000,
          });
        }

        // 🔍 Lấy mô tả sản phẩm
        const description = await page
          .$eval(
            ".ProductContent_description-container__miT3z",
            (el) => el.innerHTML?.trim() || ""
          )
          .catch(() => "");

        // 🔍 Lấy bảng thông số
        await page.waitForSelector(
          "#drawer-container-body > div.px-5.pb-15 .tab-content",
          { timeout: 10000 }
        );
        const groups = await page
          .$$eval(
            "#drawer-container-body > div.px-5.pb-15 .tab-content",
            (els) => {
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
                    const text =
                      row.querySelector(".flex-1")?.textContent || "";
                    value = text.replace(/\s+/g, " ").trim();
                  }

                  specs.push({ key, value });
                }

                if (specs.length) data.push({ group_name: groupName, specs });
              }
              return data;
            }
          )
          .catch(() => []);

        if (groups.length === 0) {
          console.log("⚠️ Không tìm thấy nhóm thông số!");
          await page.close();
          continue;
        }

        console.log(JSON.stringify(groups, null, 2));

        await db
          .update(productsTable)
          .set({
            metadata: {
              ...product.metadata,
              specs: groups,
              isProcessDetail: true,
            },
            description,
          })
          .where(eq(productsTable.id, product.id));

        await page.close();
      } catch (err) {
        console.error(`❌ Lỗi khi xử lý sản phẩm ${product.id}:`, err);
        console.log("😴 Đợi 1 phút rồi thử lại...");
        await sleep(60_000);
      }
    }
  } catch (fatal) {
    console.error("🔥 Lỗi nghiêm trọng:", fatal);
  } finally {
    await browser.close();
    console.log("✅ Đã đóng browser");
  }

  console.log("🏁 Hoàn tất tất cả sản phẩm!");
}

main().catch(async (err) => {
  console.error("🚨 Lỗi ngoài main:", err);
  console.log("😴 Ngủ 1 phút rồi chạy lại...");
  await sleep(60_000);
  await main();
});
