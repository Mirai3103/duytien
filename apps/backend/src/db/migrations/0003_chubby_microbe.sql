CREATE TYPE "public"."variant_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "status" "variant_status" DEFAULT 'active' NOT NULL;