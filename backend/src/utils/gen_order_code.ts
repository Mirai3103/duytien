import crypto from "crypto";
export function generateOrderCode(createdAt?: Date) {
  const now = createdAt ?? new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase(); // 4 ký tự hex

  return ["ORD", datePart, randomPart].filter(Boolean).join("-");
}
