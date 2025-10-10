ALTER TABLE "product_specs" DROP CONSTRAINT "product_specs_variant_id_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "product_variant_specs" DROP CONSTRAINT "product_variant_specs_spec_id_product_specs_id_fk";
--> statement-breakpoint
ALTER TABLE "product_specs" ADD COLUMN "product_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_specs" ADD COLUMN "key_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_specs" ADD COLUMN "value" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_specs" ADD CONSTRAINT "product_variant_specs_key_id_spec_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."spec_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specs" DROP COLUMN "variant_id";--> statement-breakpoint
ALTER TABLE "product_variant_specs" DROP COLUMN "spec_id";