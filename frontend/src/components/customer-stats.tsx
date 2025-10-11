import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Star, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Tổng khách hàng",
    value: "8,945",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Khách hàng mới",
    value: "234",
    icon: UserCheck,
    color: "text-green-500",
  },
  {
    title: "Khách VIP",
    value: "156",
    icon: Star,
    color: "text-yellow-500",
  },
  {
    title: "Tăng trưởng",
    value: "+12.5%",
    icon: TrendingUp,
    color: "text-green-500",
  },
]

export function CustomerStats() {
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
