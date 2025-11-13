import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductHighlightsProps {
  highlights: string[];
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Thông số nổi bật</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {highlights.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

