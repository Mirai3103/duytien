import db from "@/db";
import {
	orders,
	orderItems,
	products,
	productVariants,
	user,
} from "@/db/schema";
import { protectedProcedure, router } from "../trpc";
import { sql, and, gte, lte, eq, desc, count, sum, asc } from "drizzle-orm";
import z from "zod";

export const dashboardRoute = router({
	// Get dashboard statistics with comparisons to last month
	getStats: protectedProcedure.query(async () => {
		const now = new Date();
		const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const startOfLastMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			1
		);
		const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

		// Current month revenue
		const currentMonthRevenue = await db
			.select({
				total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
			})
			.from(orders)
			.where(
				and(
					gte(orders.createdAt, startOfCurrentMonth),
					eq(orders.status, "delivered")
				)
			);

		// Last month revenue
		const lastMonthRevenue = await db
			.select({
				total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
			})
			.from(orders)
			.where(
				and(
					gte(orders.createdAt, startOfLastMonth),
					lte(orders.createdAt, endOfLastMonth),
					eq(orders.status, "delivered")
				)
			);

		// Current month orders
		const currentMonthOrders = await db
			.select({
				count: count(),
			})
			.from(orders)
			.where(gte(orders.createdAt, startOfCurrentMonth));

		// Last month orders
		const lastMonthOrders = await db
			.select({
				count: count(),
			})
			.from(orders)
			.where(
				and(
					gte(orders.createdAt, startOfLastMonth),
					lte(orders.createdAt, endOfLastMonth)
				)
			);

		// Total products
		const totalProducts = await db.select({ count: count() }).from(products);

		// Total customers
		const totalCustomers = await db
			.select({ count: count() })
			.from(user)
			.where(eq(user.role, "customer"));

		// Calculate percentage changes
		const currentRevenue = Number.parseFloat(
			currentMonthRevenue[0]?.total || "0"
		);
		const lastRevenue = Number.parseFloat(lastMonthRevenue[0]?.total || "0");
		const revenueChange =
			lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

		const currentOrders = currentMonthOrders[0]?.count || 0;
		const lastOrders = lastMonthOrders[0]?.count || 0;
		const ordersChange =
			lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0;

		return {
			totalRevenue: currentRevenue,
			revenueChange: Number(revenueChange.toFixed(1)),
			totalOrders: currentOrders,
			ordersChange: Number(ordersChange.toFixed(1)),
			totalProducts: totalProducts[0]?.count || 0,
			productsChange: 0, // Static for now, can be calculated if needed
			totalCustomers: totalCustomers[0]?.count || 0,
			customersChange: 0, // Static for now, can be calculated if needed
		};
	}),

	// Get revenue by month for the chart (last 12 months)
	getRevenueByMonth: protectedProcedure.query(async () => {
		const now = new Date();
		const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

		const revenueData = await db
			.select({
				month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
				revenue: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
			})
			.from(orders)
			.where(
				and(gte(orders.createdAt, startDate), eq(orders.status, "delivered"))
			)
			.groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
			.orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

		// Create array of last 12 months with data
		const months = [];
		for (let i = 11; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
			const monthData = revenueData.find((d) => d.month === monthKey);

			months.push({
				month: `T${date.getMonth() + 1}`,
				revenue: Number.parseFloat(monthData?.revenue || "0"),
			});
		}

		return months;
	}),

	// Get revenue by day for current month (30 days)
	getRevenueByDay: protectedProcedure
	.input(z.object({
		month: z.number().optional().default(new Date().getMonth()),
	}))
	.query(async ({ input }) => {
		const { month } = input;
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), month, 1);
		const endOfMonth = new Date(now.getFullYear(), month + 1, 0);

		const revenueData = await db
			.select({
				day: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
				revenue: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
			})
			.from(orders)
			.where(
				and(
					gte(orders.createdAt, startOfMonth),
					lte(orders.createdAt, endOfMonth),
					eq(orders.status, "delivered")
				)
			)
			.groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
			.orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`);

		// Create array for all days of current month
		const days = [];
		const daysInMonth = endOfMonth.getDate();

		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(now.getFullYear(), now.getMonth(), i);
			const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
			const dayData = revenueData.find((d) => d.day === dayKey);

			days.push({
				day: `${i}`,
				revenue: Number.parseFloat(dayData?.revenue || "0"),
			});
		}

		return days;
	}),

	// Get orders by day for the current week
	getOrdersByWeek: protectedProcedure.query(async () => {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
		startOfWeek.setHours(0, 0, 0, 0);

		const ordersData = await db
			.select({
				day: sql<string>`TO_CHAR(${orders.createdAt}, 'D')`,
				count: count(),
			})
			.from(orders)
			.where(gte(orders.createdAt, startOfWeek))
			.groupBy(sql`TO_CHAR(${orders.createdAt}, 'D')`)
			.orderBy(sql`TO_CHAR(${orders.createdAt}, 'D')`);

		// Map days to Vietnamese labels
		const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
		const weekData = dayLabels.map((label, index) => {
			const dayNum = String(index + 2 > 7 ? 1 : index + 2); // Adjust for Monday start
			const dayData = ordersData.find((d) => d.day === dayNum);
			return {
				day: label,
				orders: dayData?.count || 0,
			};
		});

		return weekData;
	}),

	// Get pending orders (orders waiting for confirmation)
	getRecentOrders: protectedProcedure.query(async () => {
		const recentOrders = await db
			.select({
				id: orders.id,
				code: orders.code,
				totalAmount: orders.totalAmount,
				status: orders.status,
				createdAt: orders.createdAt,
				userName: user.name,
			})
			.from(orders)
			.leftJoin(user, eq(orders.userId, user.id))
			.where(eq(orders.status, "pending"))
			.orderBy(asc(orders.createdAt))
			.limit(5);

		// Get first item for each order to show product name
		const ordersWithProducts = await Promise.all(
			recentOrders.map(async (order) => {
				const firstItem = await db
					.select({
						variantName: productVariants.name,
						productName: products.name,
					})
					.from(orderItems)
					.leftJoin(
						productVariants,
						eq(orderItems.variantId, productVariants.id)
					)
					.leftJoin(products, eq(productVariants.productId, products.id))
					.where(eq(orderItems.orderId, order.id))
					.limit(1);

				return {
					id: order.code || `#${order.id}`,
					customer: order.userName || "Khách hàng",
					product: firstItem[0]?.productName || "Sản phẩm",
					amount: Number.parseFloat(order.totalAmount),
					status: order.status,
				};
			})
		);

		return ordersWithProducts;
	}),

	// Get top selling products (top 5)
	getTopProducts: protectedProcedure.query(async () => {
		const topProducts = await db
			.select({
				productId: products.id,
				productName: products.name,
				totalSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
			})
			.from(orderItems)
			.leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
			.leftJoin(products, eq(productVariants.productId, products.id))
			.innerJoin(orders, eq(orderItems.orderId, orders.id))
			.where(eq(orders.status, "delivered"))
			.groupBy(products.id, products.name)
			.orderBy(desc(sql`SUM(${orderItems.quantity})`))
			.limit(5);

		// Calculate max for percentage
		const maxSales =
			topProducts.length > 0 && topProducts[0]
				? Number(topProducts[0].totalSold)
				: 1;

		return topProducts
			.filter((product) => product.productName)
			.map((product) => ({
				name: product.productName || "Sản phẩm",
				sales: Number(product.totalSold),
				percentage:
					maxSales > 0 ? (Number(product.totalSold) / maxSales) * 100 : 0,
			}));
	}),
});
