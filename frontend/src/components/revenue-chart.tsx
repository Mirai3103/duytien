"use client";

import { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

const monthNames = [
	"Tháng 1",
	"Tháng 2",
	"Tháng 3",
	"Tháng 4",
	"Tháng 5",
	"Tháng 6",
	"Tháng 7",
	"Tháng 8",
	"Tháng 9",
	"Tháng 10",
	"Tháng 11",
	"Tháng 12",
];

export function RevenueChart() {
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth()
	);
	
	const trpc = useTRPC();
	const { data: revenueData, isLoading } = useQuery(
		trpc.dashboard.getRevenueByDay.queryOptions({
			month: selectedMonth,
		})
	);

	if (isLoading) {
		return (
			<Card className="bg-card border-border">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle className="text-foreground">
						Doanh thu theo ngày
					</CardTitle>
					<Select
						value={selectedMonth.toString()}
						onValueChange={(value) => setSelectedMonth(parseInt(value))}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{monthNames.map((monthName, index) => (
								<SelectItem key={index} value={index.toString()}>
									{monthName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle className="text-foreground">
					Doanh thu theo ngày
				</CardTitle>
				<Select
					value={selectedMonth.toString()}
					onValueChange={(value) => setSelectedMonth(parseInt(value))}
				>
					<SelectTrigger className="w-[140px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{monthNames.map((monthName, index) => (
							<SelectItem key={index} value={index.toString()}>
								{monthName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={(revenueData as any[]) || []}>
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
						<XAxis 
							dataKey="day" 
							stroke="hsl(0 0% 60%)"
							interval="preserveStartEnd"
							tick={{ fontSize: 12 }}
						/>
						<YAxis 
							stroke="hsl(0 0% 60%)"
							tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(0 0% 10%)",
								border: "1px solid hsl(0 0% 20%)",
								borderRadius: "8px",
								color: "hsl(0 0% 95%)",
							}}
							formatter={(value: number) => `₫${value.toLocaleString()}`}
							labelFormatter={(label) => `Ngày ${label}`}
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
