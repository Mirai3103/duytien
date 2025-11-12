import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

export function OrdersChart() {
	const trpc = useTRPC();
	const { data: ordersData, isLoading } = useQuery(
		trpc.dashboard.getOrdersByWeek.queryOptions()
	);

	if (isLoading) {
		return (
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Đơn hàng trong tuần</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[300px] flex items-center justify-center">
						<div className="text-muted-foreground">Đang tải...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Đơn hàng trong tuần</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={ordersData || []}>
						<CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
						<XAxis dataKey="day" stroke="hsl(0 0% 60%)" />
						<YAxis stroke="hsl(0 0% 60%)" />
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(0 0% 10%)",
								border: "1px solid hsl(0 0% 20%)",
								borderRadius: "8px",
								color: "hsl(0 0% 95%)",
							}}
							formatter={(value: number) => `${value} đơn`}
						/>
						<Bar
							dataKey="orders"
							fill="hsl(353 100% 42%)"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
