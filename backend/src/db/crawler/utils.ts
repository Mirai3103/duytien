import { and, eq } from "drizzle-orm";
import db from "..";
import { attributes, attributeValues, brands, categories } from "../schema";

async function upsertBrand(name: string): Promise<number> {
  const brand = await db.query.brands.findFirst({
    where: eq(brands.name, name),
  });
  if (brand) {
    return brand.id;
  }
  return await db
    .insert(brands)
    .values({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
    })
    .returning()
    .then((r) => r[0]!.id);
}

async function upsertCategory(
  name: string,
  parentId?: number | null
): Promise<number> {
  const category = await db.query.categories.findFirst({
    where: eq(categories.name, name),
  });
  if (category) {
    return category.id;
  }
  return await db
    .insert(categories)
    .values({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      parentId: parentId ?? null,
    })
    .returning()
    .then((r) => r[0]!.id);
}

async function upsertAttribute(name: string): Promise<number> {
  const attribute = await db.query.attributes.findFirst({
    where: eq(attributes.name, name),
  });
  if (attribute) {
    return attribute.id;
  }
  return await db
    .insert(attributes)
    .values({ name })
    .returning()
    .then((r) => r[0]!.id);
}
async function upsertAttributeValue(
  attributeId: number,
  value: string,
  metadata: any
): Promise<number> {
  const attributeValue = await db.query.attributeValues.findFirst({
    where: and(
      eq(attributeValues.attributeId, attributeId),
      eq(attributeValues.value, value)
    ),
  });
  if (attributeValue) {
    return attributeValue.id;
  }
  return await db
    .insert(attributeValues)
    .values({ attributeId, value, metadata })
    .returning()
    .then((r) => r[0]!.id);
}

export { upsertBrand, upsertCategory, upsertAttribute, upsertAttributeValue };
