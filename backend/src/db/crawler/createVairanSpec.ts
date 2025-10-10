import db from "..";
import type { Attribute, AttributeItem } from "./type";
import { insertSpecValueToProductVariant } from "./utils";

const products = await db.query.productVariants.findMany();
type Group = {
  group_name: string;
  specs: { key: string; value: string|string[] }[];
};
for await (const product of products) {
  const metadata = product.metadata;
  const specs = metadata.specs as AttributeItem[];
  for await (const spec of specs) {
    const groupName = spec.groupName;
    const specs2 = spec.attributes;
    for await (const spec2 of specs2) {
      const key = spec2.displayName;
      const value = getValue(spec2.value);
      console.log(value)
      const groupId = await insertSpecValueToProductVariant(key, value, product.id, groupName);
    }
  }
  console.log(`${product.id} ${product.name}`)
}

function getValue(value: any) {
    if(!value) return "";
  if (Array.isArray(value)) {
    const isObject= value.every(item => typeof item === "object");
    if (isObject) {
      return value.map(getValueObject).join(",");
    }
    return value.join(",");
  }
  if (typeof value === "object") {
    return getValueObject(value);
  }
  return value+"";
 
}
function getValueObject(value: any) {
  return value.displayValue;
}