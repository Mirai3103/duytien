import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const products = [
  { name: "iPhone 15 Pro Max", sales: 234, percentage: 85 },
  { name: "Samsung Galaxy S24", sales: 189, percentage: 68 },
  { name: "AirPods Pro 2", sales: 156, percentage: 56 },
  { name: "iPad Air M2", sales: 134, percentage: 48 },
  { name: "MacBook Air M3", sales: 98, percentage: 35 },
]

export function TopProducts() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} đã bán</p>
              </div>
              <Progress value={product.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
