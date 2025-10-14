import { eq } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { productVariants } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const variantsRoute = router({
	getVariants: publicProcedure.input(z.number()).query(async ({ input }) => {
		console.log(input);
		return await db.query.productVariants.findMany({
			columns: {
				metadata: false,
			},
			where: eq(productVariants.productId, input),
			with: {
				variantValues: {
					with: {
						value: {
							with: {
								attribute: true,
							},
						},
					},
				},
			},
		});
	}),
	getVariantDetail: publicProcedure
		.input(z.number())
		.query(async ({ input }) => {
			return await db.query.productVariants.findFirst({
				where: eq(productVariants.id, input),
				with: {
					variantValues: {
						with: {
							value: {
								with: {
									attribute: true,
								},
							},
						},
					},
					specs: {
						with: {
							value: {
								with: {
									key: {
										with: {
											group: true,
										},
									},
								},
							},
						},
					},
					images: true,
				},
			});
		}),
});
