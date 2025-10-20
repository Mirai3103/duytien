import db from "..";
import { insertSpecValueToProduct } from "./utils";

const products = await db.query.products.findMany();
type Group = {
	group_name: string;
	specs: { key: string; value: string | string[] }[];
};
for await (const product of products) {
	const metadata = product.metadata;
	const specs = metadata.specs as Group[];
	for await (const spec of specs) {
		const groupName = spec.group_name;
		const specs2 = spec.specs;
		for await (const spec2 of specs2) {
			const key = spec2.key;
			const value =
				typeof spec2.value === "string" ? spec2.value : spec2.value.join(",");
			if (!value) {
				console.log(`${key} ${value}`);
			}
			const _groupId = await insertSpecValueToProduct(
				key,
				value.trim(),
				product.id,
				groupName,
			);
		}
	}
	console.log(`${product.id} ${product.name}`);
}
