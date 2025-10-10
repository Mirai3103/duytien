import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  primaryKey,
  pgEnum,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ===== ENUMS =====
export const productStatusEnum = pgEnum("product_status", [
  "active",
  "inactive",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "cod",
  "vnpay",
  "momo",
  "stripe",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

// ===== USERS =====
export const users = pgTable("users", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const brands = pgTable("brands", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
});

// ===== CATEGORIES =====
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  parentId: integer("parent_id"),
});

// ===== PRODUCTS (SPU) =====
export const products = pgTable("products", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  thumbnail: varchar("thumbnail", { length: 255 }),
  status: productStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  metadata: jsonb("metadata").$type<any>(),
});

// ===== PRODUCT VARIANTS (SKU) =====
export const productVariants = pgTable("product_variants", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  productId: integer("product_id").references(() => products.id),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  image: varchar("image", { length: 255 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: jsonb("metadata").$type<any>(),
});

// ===== ATTRIBUTES =====
export const attributes = pgTable("attributes", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
});

// ===== ATTRIBUTE VALUES =====
export const attributeValues = pgTable("attribute_values", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  attributeId: integer("attribute_id")
    .references(() => attributes.id)
    .notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  metadata: jsonb("metadata"),
});

// ===== PRODUCT VARIANT VALUES =====
export const productVariantValues = pgTable("product_variant_values", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  variantId: integer("variant_id")
    .references(() => productVariants.id)
    .notNull(),
  attributeValueId: integer("attribute_value_id")
    .references(() => attributeValues.id)
    .notNull(),
});

// ===== CART ITEMS =====
export const cartItems = pgTable("cart_items", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  variantId: integer("variant_id")
    .references(() => productVariants.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(), // giá tại thời điểm thêm
});

// ===== ORDERS =====
export const orders = pgTable("orders", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 14, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  deliveryAddress: text("delivery_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== ORDER ITEMS =====
export const orderItems = pgTable("order_items", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  variantId: integer("variant_id")
    .references(() => productVariants.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
});

// ===== PAYMENTS =====
export const payments = pgTable("payments", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== REVIEWS =====
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== RELATIONS (optional but useful for Drizzle ORM queries) =====
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  reviews: many(reviews),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  reviews: many(reviews),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantValues: many(productVariantValues),
    orderItems: many(orderItems),
    specs: many(productVariantSpecs),
  })
);

export const specGroups = pgTable("spec_groups", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
});
export const specKeys = pgTable("spec_keys", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  groupId: integer("group_id")
    .references(() => specGroups.id)
    .notNull(),
});
export const specValues = pgTable("spec_values", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  keyId: integer("key_id")
    .references(() => specKeys.id)
    .notNull(),
  value: varchar("value", { length: 2000 }).notNull(),
});
// New API:

// export const users = pgTable("users", {
//     id: integer(),
// }, (t) => [
//     index('custom_name').on(t.id)
// ]);
export const productSpecs = pgTable("product_specs", { // spec of spu
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  specValueId:  integer("spec_value_id")
    .references(() => specValues.id)
    .notNull(), 
    },(table) => [
      uniqueIndex("product_specs_unique").on(table.specValueId, table.productId),
    ]);

export const productVariantSpecs = pgTable("product_variant_specs", { // spec of sku
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  variantId: integer("variant_id")
    .references(() => productVariants.id)
    .notNull(),
  specValueId:  integer("spec_value_id")
    .references(() => specValues.id)
    .notNull(), 
},(table) => [
  uniqueIndex("product_variant_specs_unique").on(table.specValueId, table.variantId),
]);
// unique constraint on specValueId and variantId
// export const productVariantSpecsUnique = uniqueIndex("product_variant_specs_unique").on(productVariantSpecs.specValueId, productVariantSpecs.variantId);
// export const productSpecsUnique = uniqueIndex("product_specs_unique").on(productSpecs.specValueId, productSpecs.productId);
export default {
  users,
  brands,
  categories,
  products,
  productVariants,
  attributes,
  attributeValues,
  specGroups,
  specKeys,
  productSpecs,
  productVariantSpecs,
  specValues,
};
