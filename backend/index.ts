async function getSpec(slug: string) {
    console.log(`https://papi.fptshop.com.vn/gw/v1/public/bff-before-order/product/attribute?slug=${slug}`)
    const rest = await fetch(`https://papi.fptshop.com.vn/gw/v1/public/bff-before-order/product/attribute?slug=${slug}`, {
        "headers": {
          "accept": "application/json",
          "accept-language": "vi;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "order-channel": "1",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1"
        },
        "referrer": "https://fptshop.com.vn/",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      });
      const response = await rest.json() as Promise<any>;
      return response;
}
getSpec("dien-thoai/iphone-17-pro-max").then(console.log)