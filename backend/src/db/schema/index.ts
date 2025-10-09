import { mysqlTable, bigint, varchar, text, boolean, int, decimal,json, timestamp, mysqlEnum, uniqueIndex, index } from "drizzle-orm/mysql-core";

// ========== USERS ==========
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
});

// ========== BRANDS ==========
export const brands = mysqlTable("brands", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 500 }),
});

// ========== CATEGORIES ==========
export const categories = mysqlTable("categories", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: bigint("parent_id", { mode: "number" })
});

// ========== PRODUCTS ==========
export const products = mysqlTable("products", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: bigint("category_id", { mode: "number" }).references(() => categories.id),
  brandId: bigint("brand_id", { mode: "number" }).references(() => brands.id),
  thumbnail: varchar("thumbnail", { length: 500 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata"),
});

// ========== PRODUCT VARIANTS ==========
export const productVariants = mysqlTable("product_variants", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  productId: bigint("product_id", { mode: "number" }).references(() => products.id),
  sku: varchar("sku", { length: 255 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  stock: int("stock").default(0),
  image: varchar("image", { length: 500 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata"),
});

// ========== ATTRIBUTES & VALUES ==========
export const attributes = mysqlTable("attributes", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
});


// ========== PRODUCT ATTRIBUTE VALUES (chung cho sản phẩm) ==========
export const productAttributeValues = mysqlTable("product_attribute_values", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  productId: bigint("product_id", { mode: "number" }).references(() => products.id),
  attributeId: bigint("attribute_id", { mode: "number" }).references(() => attributes.id),
  value: varchar("value", { length: 255 }).notNull(),
});

// ========== PRODUCT VARIANT VALUES ==========
export const productVariantValues = mysqlTable("product_variant_values", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  variantId: bigint("variant_id", { mode: "number" }).references(() => productVariants.id),
  attributeId: bigint("attribute_id", { mode: "number" }).references(() => attributes.id),
  value: varchar("value", { length: 255 }).notNull(),
});

// ========== PRODUCT IMAGES ==========
export const productImages = mysqlTable("product_images", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  productId: bigint("product_id", { mode: "number" }).references(() => products.id),
  imageUrl: varchar("image_url", { length: 500 }),
  position: int("position").default(0),
});
export const productVariantImages = mysqlTable("product_variant_images", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  variantId: bigint("variant_id", { mode: "number" }).references(() => productVariants.id),
  imageUrl: varchar("image_url", { length: 500 }),
  position: int("position").default(0),
});

// ========== CART ITEMS ==========
export const cartItems = mysqlTable("cart_items", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  variantId: bigint("variant_id", { mode: "number" }).references(() => productVariants.id),
  quantity: int("quantity").default(1),
  price: decimal("price", { precision: 12, scale: 2 }),
});

// ========== ORDERS ==========
export const orders = mysqlTable("orders", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  status: mysqlEnum("status", ["pending", "confirmed", "shipping", "delivered", "cancelled"]).default("pending"),
  totalAmount: decimal("total_amount", { precision: 14, scale: 2 }),
  paymentMethod: mysqlEnum("payment_method", ["cod", "vnpay", "momo", "stripe"]),
  deliveryAddress: text("delivery_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== ORDER ITEMS ==========
export const orderItems = mysqlTable("order_items", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  orderId: bigint("order_id", { mode: "number" }).references(() => orders.id),
  variantId: bigint("variant_id", { mode: "number" }).references(() => productVariants.id),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }),
});

// ========== PAYMENTS ==========
export const payments = mysqlTable("payments", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  orderId: bigint("order_id", { mode: "number" }).references(() => orders.id),
  amount: decimal("amount", { precision: 14, scale: 2 }),
  method: varchar("method", { length: 50 }),
  status: mysqlEnum("status", ["pending", "success", "failed"]).default("pending"),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== REVIEWS ==========
export const reviews = mysqlTable("reviews", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  productId: bigint("product_id", { mode: "number" }).references(() => products.id),
  rating: int("rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== DISCOUNTS ==========
export const discounts = mysqlTable("discounts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  code: varchar("code", { length: 100 }),
  type: mysqlEnum("type", ["percent", "fixed"]),
  value: decimal("value", { precision: 10, scale: 2 }),
  startAt: timestamp("start_at"),
  endAt: timestamp("end_at"),
  isActive: boolean("is_active").default(true),
});

export const productDiscounts = mysqlTable("product_discounts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  productId: bigint("product_id", { mode: "number" }).references(() => products.id),
  discountId: bigint("discount_id", { mode: "number" }).references(() => discounts.id),
});

export default {
  users,
  brands,
  categories,
  products,
  productVariants,
  attributes,
  productAttributeValues,
  productVariantValues,
};