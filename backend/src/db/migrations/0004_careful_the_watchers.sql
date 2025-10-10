CREATE TABLE "spec_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "spec_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key_id" integer NOT NULL,
	"value" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_specs" DROP CONSTRAINT "product_specs_key_id_spec_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "product_variant_specs" DROP CONSTRAINT "product_variant_specs_key_id_spec_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "product_specs" ADD COLUMN "spec_value_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_specs" ADD COLUMN "spec_value_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "spec_values" ADD CONSTRAINT "spec_values_key_id_spec_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."spec_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_spec_value_id_spec_values_id_fk" FOREIGN KEY ("spec_value_id") REFERENCES "public"."spec_values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_specs" ADD CONSTRAINT "product_variant_specs_spec_value_id_spec_values_id_fk" FOREIGN KEY ("spec_value_id") REFERENCES "public"."spec_values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specs" DROP COLUMN "key_id";--> statement-breakpoint
ALTER TABLE "product_specs" DROP COLUMN "value";--> statement-breakpoint
ALTER TABLE "product_variant_specs" DROP COLUMN "key_id";--> statement-breakpoint
ALTER TABLE "product_variant_specs" DROP COLUMN "value";