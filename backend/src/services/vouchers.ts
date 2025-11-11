export const getVoucherReducePrice = (totalAmount: number, discount: number, maxDiscount: number | null, type: "percentage" | "fixed") => {
  let reducePrice = 0;
  if(type === "percentage") {
    reducePrice = totalAmount * (discount / 100);
  } else {
    reducePrice = totalAmount - discount;
  }
  
  return Math.min(reducePrice, maxDiscount || Infinity);
}