

export function getFinalPrice(price: number, discount: number) {
  if (discount < 1) {
    return price - price * discount;
  }
  return price - discount;
}

export function getDiscountPercentage(originalPrice: number, discount: number) {
  if (discount <= 0) {
    return 0;
  }
  if (discount < 1) {
    return discount * 100;
  }
  const discountPercentage = (discount / originalPrice) * 100;
  return discountPercentage.toFixed(0);
}

export function getReducePrice(originalPrice: number, discount: number) {
  return originalPrice - getFinalPrice(originalPrice, discount);
}
