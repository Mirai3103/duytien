ALTER TABLE "orders" ALTER COLUMN "code" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "is_hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_code_unique" UNIQUE("code");