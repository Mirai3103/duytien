// ================================
// CRAWL TOÀN BỘ SẢN PHẨM TỪ CELLPHONES GRAPHQL API
// ================================

import fs from "node:fs";
import fetch from "node-fetch"; // Node >=18 thì có sẵn, không cần install

// ======== CONFIG ==========
const CATEGORY_ID = "3"; // ID danh mục (ví dụ: 3 = Điện thoại)
const PROVINCE_ID = 30; // ID tỉnh (30 = HCM)
const PAGE_SIZE = 20; // số sản phẩm mỗi trang
const OUTPUT_FILE = "cellphones_products.json";
// ===========================

async function fetchProducts(page) {
	const query = `
  query GetProductsByCateId($page:Int!, $size:Int!){
    products(
      filter:{
        static:{
          categories:["${CATEGORY_ID}"],
          province_id:${PROVINCE_ID},
          stock:{from:0},
          stock_available_id:[46,56,152,4920],
          filter_price:{from:0,to:63990000}
        }
      },
      page:$page,
      size:$size,
      sort:[{view:desc}]
    ){
      general{
        product_id
        name
        attributes
        sku
        doc_quyen
        manufacturer
        url_key
        url_path
        categories{
          categoryId
          name
          uri
        }
        review{
          total_count
          average_rating
        }
      }
      filterable{
        is_installment
        stock_available_id
        company_stock_id
        filter{
          id
          Label
        }
        is_parent
        price
        prices
        special_price
        promotion_information
        thumbnail
        promotion_pack
        sticker
        flash_sale_types
        is_new_arrival
      }
      configurable{
        options{
          id
          label
          values{
            id
            label
            price
            is_available
            sku
            thumbnail
          }
        }
      }
      stock{
        stock_id
        stock_available_id
        qty
        province_id
        store_name
      }
      meta{
        total
        page
        size
        has_next
        has_previous
      }
    }
  }`;

	const res = await fetch("https://api.cellphones.com.vn/v2/graphql/query", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: { page, size: PAGE_SIZE },
		}),
	});

	const json = await res.json();

	if (json.errors) {
		console.error("GraphQL errors:", json.errors);
		throw new Error("GraphQL query failed");
	}

	return json.data.products;
}

// ================================
// MAIN FUNCTION
// ================================
async function main() {
	console.log("🚀 Bắt đầu crawl Cellphones API...");
	let page = 1;
	const allProducts = [];

	while (true) {
		if (page > 5) break;
		console.log(`📄 Fetching page ${page}...`);
		const data = await fetchProducts(page);
		if (!data || (!data.general && !Array.isArray(data))) {
			console.error("⚠️ Unexpected data format:", data);
			break;
		}

		// vì API trả mỗi lần một object chứa list field, ta gom từng page
		const chunk = Array.isArray(data) ? data : [data];
		allProducts.push(...chunk);

		// kiểm tra meta
		const meta = data.meta || {};
		if (!meta.has_next) break;

		page++;
	}

	// lưu ra file
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
	console.log(
		`✅ Crawl xong ${allProducts.length} sản phẩm. Lưu vào ${OUTPUT_FILE}`,
	);
}

main().catch(console.error);
