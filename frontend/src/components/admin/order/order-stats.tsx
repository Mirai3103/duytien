import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react"

const stats = [
  {
    title: "Tổng đơn hàng",
    value: "1,234",
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  {
    title: "Chờ xử lý",
    value: "45",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "Hoàn thành",
    value: "1,089",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "Đã hủy",
    value: "100",
    icon: XCircle,
    color: "text-red-500",
  },
]

export function OrderStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
