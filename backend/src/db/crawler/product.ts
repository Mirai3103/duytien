// fetch("https://api.cellphones.com.vn/v2/graphql/query", {
//     "headers": {
//       "accept": "application/json",
//       "accept-language": "vi;q=0.7",
//       "cache-control": "no-cache",
//       "content-type": "application/json",
//       "pragma": "no-cache",
//       "priority": "u=1, i",
//       "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"Linux\"",
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-site",
//       "sec-gpc": "1"
//     },
//     "body": "{\"query\":\"\\n            query GetProductsByCateId{\\n                products(\\n                        filter: {\\n                            static: {\\n                                categories: [\\\"3\\\"],\\n                                province_id: 30,\\n                                stock: {\\n                                   from: 0\\n                                },\\n                                stock_available_id: [46, 56, 152, 4920],\\n                               filter_price: {from:0to:63990000}\\n                               \\n                            },\\n                            dynamic: {\\n                                \\n                                \\n                            }\\n                        },\\n                        page: 3,\\n                        size: 20,\\n                        sort: [{view: desc}]\\n                    )\\n                {\\n                    general{\\n                        product_id\\n                        name\\n                        attributes\\n                        sku\\n                        doc_quyen\\n                        manufacturer\\n                        url_key\\n                        url_path\\n                        categories{\\n                            categoryId\\n                            name\\n                            uri\\n                        }\\n                        review{\\n                            total_count\\n                            average_rating\\n                        }\\n                    },\\n                    filterable{\\n                        is_installment\\n                        stock_available_id\\n                        company_stock_id\\n                        filter {\\n                           id\\n                           Label\\n                        }\\n                        is_parent\\n                        price\\n                        prices\\n                        special_price\\n                        promotion_information\\n                        thumbnail\\n                        promotion_pack\\n                        sticker\\n                        flash_sale_types\\n                        is_new_arrival\\n                    },\\n                }\\n            }\",\"variables\":{}}",
//     "method": "POST",
//     "mode": "cors",
//     "credentials": "omit"
//   }).then(async(r)=>{
//     await Bun.write("products.json", JSON.stringify(await r.json(), null, 2))
//   }).catch(e=>{
//     console.error(e)
//   })