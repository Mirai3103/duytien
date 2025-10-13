import { and, eq } from "drizzle-orm";
import db from "..";
import {
  attributes,
  attributeValues,
  brands,
  categories,
  productSpecs,
  productVariantSpecs,
  specGroups,
  specKeys,
  specValues,
} from "../schema";

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
async function upsertSpecGroup(name: string): Promise<number> {
  const specGroup = await db.query.specGroups.findFirst({
    where: eq(specGroups.name, name),
  });
  if (specGroup) {
    return specGroup.id;
  }
  return await db
    .insert(specGroups)
    .values({ name })
    .returning()
    .then((r) => r[0]!.id);
}
async function upsertSpecKey(name: string, groupId: number): Promise<number> {
  const specKey = await db.query.specKeys.findFirst({
    where: and(eq(specKeys.name, name), eq(specKeys.groupId, groupId)),
  });
  if (specKey) {
    return specKey.id;
  }
  return await db
    .insert(specKeys)
    .values({ name, groupId })
    .returning()
    .then((r) => r[0]!.id);
}
async function upsertSpecValue(
  value: string,
  key: string,
  group: string
): Promise<number> {
  const groupId = await upsertSpecGroup(group);
  const keyId = await upsertSpecKey(key, groupId);
  const specValue = await db.query.specValues.findFirst({
    where: and(eq(specValues.value, value), eq(specValues.keyId, keyId)),
  });
  if (specValue) {
    console.log(`${value} ${key} ${group} already exists`);
    return specValue.id;
  }
  return await db
    .insert(specValues)
    .values({ value, keyId })
    .returning()
    .then((r) => r[0]!.id);
}

async function insertSpecValueToProduct(
  key: string,
  value: string,
  productId: number,
  group: string
) {
  const specValueId = await upsertSpecValue(value, key, group);
  return await db
    .insert(productSpecs)
    .values({ productId, specValueId })
    .onConflictDoNothing()
    .returning();
}

async function insertSpecValueToProductVariant(
  key: string,
  value: string,
  variantId: number,
  group: string
) {
  const specValueId = await upsertSpecValue(value, key, group);
  await db
    .insert(productVariantSpecs)
    .values({ variantId, specValueId })
    .onConflictDoNothing()
    .returning();
}

export {
  upsertBrand,
  upsertCategory,
  upsertAttribute,
  upsertAttributeValue,
  upsertSpecGroup,
  upsertSpecKey,
  insertSpecValueToProduct,
  insertSpecValueToProductVariant,
};
