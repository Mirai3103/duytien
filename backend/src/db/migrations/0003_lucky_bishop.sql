
ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;

ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint