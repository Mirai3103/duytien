import { Button } from "@/components/ui/button";
import { Heart, Share2, GitCompare } from "lucide-react";

interface ProductActionsProps {
  isInCompare: boolean;
  onAddToCompare: () => void;
}

export function ProductActions({
  isInCompare,
  onAddToCompare,
}: ProductActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex-1">
        <Heart className="h-4 w-4 mr-2" />
        Yêu thích
      </Button>
      <Button variant="outline" className="flex-1">
        <Share2 className="h-4 w-4 mr-2" />
        Chia sẻ
      </Button>
      <Button
        variant={isInCompare ? "default" : "outline"}
        className="flex-1"
        onClick={onAddToCompare}
      >
        <GitCompare className="h-4 w-4 mr-2" />
        {isInCompare ? "Đã thêm" : "So sánh"}
      </Button>
    </div>
  );
}

