import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    return (discount * 100).toFixed(0);
  }
  const discountPercentage = (discount / originalPrice) * 100;
  console.log(discountPercentage);
  return discountPercentage.toFixed(0);
}

export function getReducePrice(originalPrice: number, discount: number) {
  return originalPrice - getFinalPrice(originalPrice, discount);
}
