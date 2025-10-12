import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags, Package, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Tổng thương hiệu",
    value: "24",
    icon: Tags,
    color: "text-blue-500",
  },
  {
    title: "Sản phẩm",
    value: "456",
    icon: Package,
    color: "text-green-500",
  },
  {
    title: "Tăng trưởng",
    value: "+12%",
    icon: TrendingUp,
    color: "text-purple-500",
  },
];

export function BrandStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

