ALTER TABLE "spec_values" ALTER COLUMN "value" SET DATA TYPE varchar(2000);--> statement-breakpoint
CREATE UNIQUE INDEX "product_specs_unique" ON "product_specs" USING btree ("spec_value_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variant_specs_unique" ON "product_variant_specs" USING btree ("spec_value_id","variant_id");