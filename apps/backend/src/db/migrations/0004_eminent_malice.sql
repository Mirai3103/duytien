CREATE TABLE "product_required_attributes" (
	"product_id" integer NOT NULL,
	"attribute_id" integer NOT NULL,
	"default_value" varchar(255),
	CONSTRAINT "product_required_attributes_product_id_attribute_id_pk" PRIMARY KEY("product_id","attribute_id")
);
--> statement-breakpoint
ALTER TABLE "product_required_attributes" ADD CONSTRAINT "product_required_attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_required_attributes" ADD CONSTRAINT "product_required_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;