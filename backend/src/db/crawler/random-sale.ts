import { faker } from "@faker-js/faker/locale/vi";
import db from "..";
import { products as productsTable } from "../schema";
import { eq } from "drizzle-orm";


const products = await db.query.products.findMany({
  columns: {
    id: true,
  },
});
const randomPercents = [4,5,8,10,14,16,20];

const NUMBER_OF_PRODUCTS = 15;
for (let i = 0; i < NUMBER_OF_PRODUCTS; i++) {
    const randomPercent = faker.helpers.arrayElement(randomPercents);
    await db.update(productsTable).set({
        discount: (randomPercent / 100).toString(),
    }).where(eq(productsTable.id, products[i]?.id!));
}