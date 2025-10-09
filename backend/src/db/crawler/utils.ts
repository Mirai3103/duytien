import { eq } from "drizzle-orm";
import db from "..";
import { brands, categories } from "../schema";

async function upsertBrand(name: string) : Promise<number> {
    const brand = await db.query.brands.findFirst({
        where: eq(brands.name, name)
    })
    if (brand) {
        return brand.id
    }
    return await db.insert(brands).values({ name }).$returningId().then(r => r[0]!.id)
}

async function upsertCategory(name: string, parentId: number) : Promise<number> {
    const category = await db.query.categories.findFirst({
        where: eq(categories.name, name)
    })
    if (category) {
        return category.id
    }
    return await db.insert(categories).values({ name, parentId }).$returningId().then(r => r[0]!.id)
}

export {
    upsertBrand,
    upsertCategory
}