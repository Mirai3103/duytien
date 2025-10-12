import { Card, CardContent } from "@/components/ui/card"
import { Package, AlertCircle, TrendingUp, Layers } from "lucide-react"

const stats = [
  {
    title: "Tổng SKU",
    value: "60",
    change: "+12 SKU mới",
    icon: Layers,
    color: "text-blue-500",
  },
  {
    title: "Đang bán",
    value: "54",
    change: "90% tổng SKU",
    icon: Package,
    color: "text-green-500",
  },
  {
    title: "Sắp hết hàng",
    value: "8",
    change: "Cần nhập thêm",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  {
    title: "Bán chạy nhất",
    value: "iPhone 15 Pro",
    change: "256GB Titan Tự nhiên",
    icon: TrendingUp,
    color: "text-primary",
  },
]

export function SkuStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
