import { Shield, Truck, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const POLICIES: {
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    icon: Shield,
    title: "Bảo hành chính hãng 12 tháng",
    description: "Bảo hành tại các trung tâm Apple ủy quyền",
  },
  {
    icon: Truck,
    title: "Giao hàng miễn phí toàn quốc",
    description: "Giao hàng trong 2-3 ngày",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả trong 7 ngày",
    description: "Nếu có lỗi từ nhà sản xuất",
  },
  {
    icon: Shield,
    title: "1 đổi 1 trong 30 ngày",
    description: "Với sản phẩm lỗi từ nhà sản xuất",
  },
];

export function ProductPolicies() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {POLICIES.map((policy, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0">
                <policy.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{policy.title}</p>
                <p className="text-xs text-muted-foreground">
                  {policy.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

