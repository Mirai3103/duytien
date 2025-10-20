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

const data = [
	{ day: "T2", orders: 45 },
	{ day: "T3", orders: 52 },
	{ day: "T4", orders: 48 },
	{ day: "T5", orders: 61 },
	{ day: "T6", orders: 55 },
	{ day: "T7", orders: 67 },
	{ day: "CN", orders: 72 },
];

export function OrdersChart() {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Đơn hàng trong tuần</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
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
