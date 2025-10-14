"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
	{ month: "T1", revenue: 45000000 },
	{ month: "T2", revenue: 52000000 },
	{ month: "T3", revenue: 48000000 },
	{ month: "T4", revenue: 61000000 },
	{ month: "T5", revenue: 55000000 },
	{ month: "T6", revenue: 67000000 },
	{ month: "T7", revenue: 72000000 },
	{ month: "T8", revenue: 68000000 },
	{ month: "T9", revenue: 75000000 },
	{ month: "T10", revenue: 82000000 },
	{ month: "T11", revenue: 88000000 },
	{ month: "T12", revenue: 95000000 },
];

export function RevenueChart() {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Doanh thu theo tháng</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="hsl(210 100% 50%)"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="hsl(210 100% 50%)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
						<XAxis dataKey="month" stroke="hsl(0 0% 60%)" />
						<YAxis stroke="hsl(0 0% 60%)" />
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(0 0% 10%)",
								border: "1px solid hsl(0 0% 20%)",
								borderRadius: "8px",
								color: "hsl(0 0% 95%)",
							}}
							formatter={(value: number) => `₫${value.toLocaleString()}`}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="hsl(210 100% 50%)"
							strokeWidth={2}
							fill="url(#colorRevenue)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
