CREATE TYPE "public"."pay_type" AS ENUM('full', 'partial');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pay_type" "pay_type" DEFAULT 'full' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "identity_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "full_name" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "next_pay_day" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "next_pay_amount" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "installment_count" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "remaining_installments" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_paid_amount" numeric(14, 2);