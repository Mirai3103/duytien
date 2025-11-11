
// generate random user
import { auth } from "@/auth";
import { faker } from "@faker-js/faker/locale/vi";
import db from "..";
import { addresses, cartItems, orderItems, orders, payments } from "../schema";
import { generateOrderCode } from "@/utils/gen_order_code";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

// for (let i = 0; i < 100; i++) {
//   await auth.api.signUpEmail({
//     body:{
//         email:faker.internet.email(),
//         name:faker.person.fullName(),
//         password: "Kaito@1412",
//     }
//   });
// }
// drop all orders, payments, order items
await db.delete(orders);
await db.delete(payments);
await db.delete(orderItems);
const allVariants = await db.query.productVariants.findMany({
    columns: {
        id: true,
        price: true,
        productId: true,
        stock: true,
    },
    with: {
        product: {
            columns: {
                id: true,
                name: true,
            },
        },
    },
});

const allUsers:{
    id: string;
    name: string;
    email: string;
    addressId?: number;
}[] = await db.query.user.findMany({
    columns: {
        id: true,
        name: true,
        email: true,
    },
});
//  create user default address
for (const user of allUsers) {
    const [address] = await db.insert(addresses).values({
        detail: faker.location.streetAddress(),
        fullName: faker.person.fullName(),
        phone: faker.phone.number(),
        province: faker.location.state(),
        ward: faker.location.city(),
        isDefault: true,
        userId: user.id,
    }).returning();
    user.addressId = address?.id;
}
type CartItemData = {
    quantity: number;
    price: string;
    variantId: number;
}
// generate random order
let k = 0;
for (const user of allUsers) {
    const numberOfOrders = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numberOfOrders; i++) {
        console.log(k++);
        const cartItemsLength = faker.number.int({ min: 1, max: 3 });
        const cartItemsData = new Map<number, CartItemData>();
        for (let j = 0; j < cartItemsLength; j++) {
            const randomVariant = faker.helpers.arrayElement(allVariants);
            cartItemsData.set(randomVariant.id, {
                quantity: faker.number.int({ min: 1, max: randomVariant.stock <=3 ? randomVariant.stock : 3 }),
                price: randomVariant.price,
                variantId: randomVariant.id,
            });
        }
        const totalAmount = Array.from(cartItemsData.values()).reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
        const placedAt = faker.date.between({
            from: dayjs().subtract(1, "year").toDate(),
            to: dayjs().toDate(),
        });
        const [order] = await db.insert(orders).values({
            paymentMethod: faker.helpers.arrayElement(["cod", "vnpay", "momo"]),
            totalAmount: totalAmount.toString(),
            userId: user.id,
            code: generateOrderCode(placedAt),
            createdAt: placedAt,
            deliveryAddressId: user.addressId,
            totalItems: cartItemsData.size,
            note: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(["pending", "confirmed", "shipping", "delivered", "cancelled"]),
        }).returning();
        console.log(order?.code);
        for (const [variantId, cartItemData] of cartItemsData.entries()) {
            await db.insert(orderItems).values({
                orderId: order!.id,
                variantId: variantId,
                quantity: cartItemData.quantity,
                price: cartItemData.price,
            });
        }
        const [payment] = await db.insert(payments).values({
            orderId: order!.id,
            amount: totalAmount.toString(),
            method: order!.paymentMethod,
            status: faker.helpers.arrayElement(["pending", "success", "failed"]),
        }).returning();
        await db.update(orders).set({
            lastPaymentId: payment!.id,
        }).where(eq(orders.id, order!.id));
    }
}