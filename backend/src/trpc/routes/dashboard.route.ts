


import db from "@/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";

// get dashboard data
const cache = new Map<string, any>();
// Tổng doanh thu
// ₫245,890,000
// +12.5%
// so với tháng trước
// Đơn hàng
// 1,234
// +8.2%
// so với tháng trước
// Sản phẩm
// 456
// +3.1%
// so với tháng trước
// Khách hàng
// 8,945
// -2.4%
// so với tháng trước
// const dashboardRoute = router({


    
