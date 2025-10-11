import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  pgEnum,
  jsonb,
  foreignKey,
  primaryKey,
  uniqueIndex,
  check,
  index,
} from "drizzle-orm/pg-core";

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
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

export const voucherTypes = pgEnum("voucher_types", ["percentage", "fixed"]);

// ===== USERS =====
export const users = pgTable(
  "users",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    full_name: varchar("name", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    address: text("address"),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)]
);

// ===== BRANDS =====
export const brands = pgTable(
  "brands",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    logo: varchar("logo", { length: 255 }),
  },
  (t) => [uniqueIndex("brands_slug_unique").on(t.slug)]
);

// ===== CATEGORIES =====
export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    parentId: integer("parent_id"),
  },
  (t) => [
    uniqueIndex("categories_slug_unique").on(t.slug),
    index("categories_parent_idx").on(t.parentId),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== PRODUCTS (SPU) =====
export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    brandId: integer("brand_id"),
    categoryId: integer("category_id"),
    thumbnail: varchar("thumbnail", { length: 255 }),
    status: productStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    metadata: jsonb("metadata").$type<any>(),
  },
  (t) => [
    uniqueIndex("products_slug_unique").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_status_idx").on(t.status),
    index("products_brand_idx").on(t.brandId),
    foreignKey({
      columns: [t.brandId],
      foreignColumns: [brands.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.categoryId],
      foreignColumns: [categories.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== PRODUCT VARIANTS (SKU) =====
export const productVariants = pgTable(
  "product_variants",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    productId: integer("product_id"),
    sku: varchar("sku", { length: 100 }).notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    image: varchar("image", { length: 255 }),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    metadata: jsonb("metadata").$type<any>(),
  },
  (t) => [
    uniqueIndex("variants_sku_unique").on(t.sku),
    index("variants_product_idx").on(t.productId),
    foreignKey({
      columns: [t.productId],
      foreignColumns: [products.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== ATTRIBUTES =====
export const attributes = pgTable(
  "attributes",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (t) => [uniqueIndex("attributes_name_unique").on(t.name)]
);

// ===== ATTRIBUTE VALUES =====
export const attributeValues = pgTable(
  "attribute_values",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    attributeId: integer("attribute_id").notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    metadata: jsonb("metadata"),
  },
  (t) => [
    index("attr_values_attr_idx").on(t.attributeId),
    uniqueIndex("attr_values_unique").on(t.attributeId, t.value),
    foreignKey({
      columns: [t.attributeId],
      foreignColumns: [attributes.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== PRODUCT VARIANT VALUES =====
export const productVariantValues = pgTable(
  "product_variant_values",
  {
    variantId: integer("variant_id").notNull(),
    attributeValueId: integer("attribute_value_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.variantId, t.attributeValueId] }),
    foreignKey({
      columns: [t.variantId],
      foreignColumns: [productVariants.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.attributeValueId],
      foreignColumns: [attributeValues.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== CART ITEMS =====
export const cartItems = pgTable(
  "cart_items",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull(),
    variantId: integer("variant_id").notNull(),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  },
  (t) => [
    index("cart_user_idx").on(t.userId),
    index("cart_variant_idx").on(t.variantId),
    uniqueIndex("cart_user_variant_unique").on(t.userId, t.variantId),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.variantId],
      foreignColumns: [productVariants.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== VOUCHERS =====
export const vouchers = pgTable(
  "vouchers",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 255 }).notNull(),
    type: voucherTypes("type").notNull(),
    discount: decimal("discount", { precision: 12, scale: 2 }).notNull(),
    maxDiscount: decimal("max_discount", { precision: 12, scale: 2 }),
    minOrderAmount: decimal("min_order_amount", { precision: 12, scale: 2 }),
    maxOrderAmount: decimal("max_order_amount", { precision: 12, scale: 2 }),
    maxUsage: integer("max_usage"),
    isActive: boolean("is_active").default(true).notNull(),
    usageCount: integer("usage_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("voucher_code_unique").on(t.code)]
);

// ===== ORDERS =====
export const orders = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: decimal("total_amount", { precision: 14, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    deliveryAddress: text("delivery_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    voucherId: integer("voucher_id"),
  },
  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.voucherId],
      foreignColumns: [vouchers.id],
    }).onDelete("set null").onUpdate("cascade"),
  ]
);

// ===== ORDER ITEMS =====
export const orderItems = pgTable(
  "order_items",
  {
    orderId: integer("order_id").notNull(),
    variantId: integer("variant_id").notNull(),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.orderId, t.variantId] }),
    foreignKey({
      columns: [t.orderId],
      foreignColumns: [orders.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.variantId],
      foreignColumns: [productVariants.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== PAYMENTS =====
export const payments = pgTable(
  "payments",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").notNull(),
    amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
    method: varchar("method", { length: 50 }),
    status: paymentStatusEnum("status").default("pending").notNull(),
    paymentDate: timestamp("payment_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("payments_order_idx").on(t.orderId),
    foreignKey({
      columns: [t.orderId],
      foreignColumns: [orders.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== REVIEWS =====
export const reviews = pgTable(
  "reviews",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull(),
    variantId: integer("variant_id").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("reviews_variant_idx").on(t.variantId),
    uniqueIndex("reviews_user_variant_unique").on(t.userId, t.variantId),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.variantId],
      foreignColumns: [productVariants.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// ===== SPECS =====
export const specGroups = pgTable(
  "spec_groups",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (t) => [uniqueIndex("spec_groups_name_unique").on(t.name)]
);

export const specKeys = pgTable(
  "spec_keys",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    groupId: integer("group_id").notNull(),
  },
  (t) => [
    uniqueIndex("spec_keys_name_unique").on(t.groupId, t.name),
    foreignKey({
      columns: [t.groupId],
      foreignColumns: [specGroups.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export const specValues = pgTable(
  "spec_values",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    keyId: integer("key_id").notNull(),
    value: varchar("value", { length: 2000 }).notNull(),
  },
  (t) => [
    uniqueIndex("spec_values_unique").on(t.keyId, t.value),
    foreignKey({
      columns: [t.keyId],
      foreignColumns: [specKeys.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export const productSpecs = pgTable(
  "product_specs",
  {
    productId: integer("product_id").notNull(),
    specValueId: integer("spec_value_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.specValueId] }),
    foreignKey({
      columns: [t.productId],
      foreignColumns: [products.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.specValueId],
      foreignColumns: [specValues.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export const productVariantSpecs = pgTable(
  "product_variant_specs",
  {
    variantId: integer("variant_id").notNull(),
    specValueId: integer("spec_value_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.variantId, t.specValueId] }),
    foreignKey({
      columns: [t.variantId],
      foreignColumns: [productVariants.id],
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.specValueId],
      foreignColumns: [specValues.id],
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);
// ===== USERS =====
export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
  reviews: many(reviews),
}));

// ===== CATEGORIES =====
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

// ===== PRODUCTS =====
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  specs: many(productSpecs),
}));

// ===== PRODUCT VARIANTS =====
export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantValues: many(productVariantValues),
    specs: many(productVariantSpecs),
    orderItems: many(orderItems),
    cartItems: many(cartItems),
    reviews: many(reviews),
  })
);

// ===== ATTRIBUTES & VALUES =====
export const attributesRelations = relations(attributes, ({ many }) => ({
  values: many(attributeValues),
}));

export const attributeValuesRelations = relations(
  attributeValues,
  ({ one, many }) => ({
    attribute: one(attributes, {
      fields: [attributeValues.attributeId],
      references: [attributes.id],
    }),
    variantValues: many(productVariantValues),
  })
);

export const productVariantValuesRelations = relations(
  productVariantValues,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productVariantValues.variantId],
      references: [productVariants.id],
    }),
    value: one(attributeValues, {
      fields: [productVariantValues.attributeValueId],
      references: [attributeValues.id],
    }),
  })
);

// ===== CART =====
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

// ===== ORDERS =====
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  voucher: one(vouchers, {
    fields: [orders.voucherId],
    references: [vouchers.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// ===== REVIEWS =====
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  variant: one(productVariants, {
    fields: [reviews.variantId],
    references: [productVariants.id],
  }),
}));

// ===== SPECS =====
export const specGroupsRelations = relations(specGroups, ({ many }) => ({
  keys: many(specKeys),
}));

export const specKeysRelations = relations(specKeys, ({ one, many }) => ({
  group: one(specGroups, {
    fields: [specKeys.groupId],
    references: [specGroups.id],
  }),
  values: many(specValues),
}));

export const specValuesRelations = relations(specValues, ({ one, many }) => ({
  key: one(specKeys, {
    fields: [specValues.keyId],
    references: [specKeys.id],
  }),
  productSpecs: many(productSpecs),
  variantSpecs: many(productVariantSpecs),
}));

export const productSpecsRelations = relations(productSpecs, ({ one }) => ({
  product: one(products, {
    fields: [productSpecs.productId],
    references: [products.id],
  }),
  value: one(specValues, {
    fields: [productSpecs.specValueId],
    references: [specValues.id],
  }),
}));

export const productVariantSpecsRelations = relations(
  productVariantSpecs,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productVariantSpecs.variantId],
      references: [productVariants.id],
    }),
    value: one(specValues, {
      fields: [productVariantSpecs.specValueId],
      references: [specValues.id],
    }),
  })
);

// ===== VOUCHERS =====
export const vouchersRelations = relations(vouchers, ({ many }) => ({
  orders: many(orders),
}));

// ===== EXPORT ALL =====
export default {
  users,
  brands,
  categories,
  products,
  productVariants,
  attributes,
  attributeValues,
  productVariantValues,
  cartItems,
  orders,
  orderItems,
  payments,
  reviews,
  specGroups,
  specKeys,
  specValues,
  productSpecs,
  productVariantSpecs,
  vouchers,
  usersRelations,
  categoriesRelations,
  productsRelations,
  productVariantsRelations,
  attributesRelations,
  attributeValuesRelations,
  productVariantValuesRelations,
  cartItemsRelations,
  ordersRelations,
  orderItemsRelations,
  paymentsRelations,
  reviewsRelations,
  specGroupsRelations,
  specKeysRelations,
  specValuesRelations,
  productSpecsRelations,
  productVariantSpecsRelations,
  vouchersRelations,
};
