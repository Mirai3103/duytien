ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "code" varchar(255) DEFAULT gen_order_code();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_items" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_payment_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_last_payment_id_payments_id_fk" FOREIGN KEY ("last_payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE cascade;

CREATE OR REPLACE FUNCTION gen_order_code()
RETURNS text AS $$
DECLARE
  now_date text;
  random_part text;
BEGIN
  now_date := TO_CHAR(NOW(), 'YYMMDD');
  random_part := UPPER(
    ENCODE(
      SUBSTRING(DECODE(MD5(RANDOM()::text || CLOCK_TIMESTAMP()::text), 'hex') FROM 1 FOR 2),
      'hex'
    )
  );
  RETURN 'ORD-' || now_date || '-' || random_part;
END;
$$ LANGUAGE plpgsql; --> statement-breakpoint

CREATE OR REPLACE FUNCTION update_last_payment_id()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET last_payment_id = NEW.id
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql; --> statement-breakpoint

CREATE TRIGGER trg_update_last_payment_id
AFTER INSERT
ON payments
FOR EACH ROW
EXECUTE FUNCTION update_last_payment_id(); --> statement-breakpoint

