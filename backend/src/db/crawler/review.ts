
// generate random user
import { auth } from "@/auth";
import { faker } from "@faker-js/faker/locale/vi";
import db from "..";
import { addresses, cartItems, orderItems, orders, payments, reviews } from "../schema";
import { generateOrderCode } from "@/utils/gen_order_code";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
function generateRating() {
    const rand = Math.random();
    if (rand < 0.05) return 1;      // 5%
    if (rand < 0.20) return 2;      // 15%
    if (rand < 0.40) return 3;      // 20%
    if (rand < 0.65) return 4;      // 25%
    return 5;                       // 40%
  }

const allOrdersItemDelivered = await db.select({
    orderId: orderItems.orderId,
    variantId: orderItems.variantId,
    userId: orders.userId,
    createdAt: orders.createdAt,
}).from(orderItems).innerJoin(orders, eq(orderItems.orderId, orders.id)).where(eq(orders.status, "delivered"));

for await (const orderItem of allOrdersItemDelivered) {
    const isVoted = faker.number.int({ min: 0, max: 3 }) > 0
    if (!isVoted) {
        continue;
    }
    await db.insert(reviews).values({
        rating: generateRating(),
        variantId: orderItem.variantId,
        userId: orderItem.userId,
        createdAt: faker.date.soon({
            refDate: orderItem.createdAt,
        }),
        comment: faker.lorem.paragraph({
            min: 1,
            max: 4,
        }),
    }).onConflictDoNothing();
}