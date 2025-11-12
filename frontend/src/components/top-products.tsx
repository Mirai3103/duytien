import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

export function TopProducts() {
	const trpc = useTRPC();
	const { data: products, isLoading } = useQuery(
		trpc.dashboard.getTopProducts.queryOptions()
	);

	if (isLoading) {
		return (
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Sản phẩm bán chạy</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="text-muted-foreground">Đang tải...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Sản phẩm bán chạy</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{products?.map((product) => (
						<div key={product.name} className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-foreground">
									{product.name}
								</p>
								<p className="text-sm text-muted-foreground">
									{product.sales} đã bán
								</p>
							</div>
							<Progress value={product.percentage} className="h-2" />
						</div>
					))}
					{(!products || products.length === 0) && (
						<div className="text-center py-8 text-muted-foreground">
							Chưa có dữ liệu bán hàng
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
