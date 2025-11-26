import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewsTab } from "./ReviewsTab";

interface SpecGroup {
  groupId: number;
  groupName: string;
  specs: Array<{
    specName: string;
    specValue: string;
  }>;
}

interface ProductDetailsTabsProps {
  productId: number;
  variantId: number;
  productName: string;
  description: string;
  specs: SpecGroup[];
  reviewCount: number;
}

export function ProductDetailsTabs({
  productId,
  variantId,
  productName,
  description,
  specs,
  reviewCount,
}: ProductDetailsTabsProps) {
  return (
    <Card>
      <CardContent className="p-3 md:p-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="description" className="text-xs md:text-sm py-2">
              Mô tả
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-xs md:text-sm py-2">
              Thông số
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs md:text-sm py-2">
              Đánh giá ({reviewCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4 md:mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Giới thiệu {productName}
              </h3>
              <div
                className="text-muted-foreground whitespace-pre-line text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: description ?? "",
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4 md:mt-6">
            <div className="space-y-4 md:space-y-6">
              {specs.map((spec) => (
                <div key={spec.groupId + spec.groupName}>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-primary">
                    {spec.groupName}
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    {spec.specs.map((spec, index) => (
                      <div
                        key={spec.specName + index}
                        className={`grid grid-cols-2 gap-2 md:gap-4 p-2 md:p-3 text-xs md:text-sm ${
                          index % 2 === 0 ? "bg-muted/30" : ""
                        }`}
                      >
                        <span className="font-medium">{spec.specName}</span>
                        <span className="text-muted-foreground break-words">
                          {spec.specValue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 md:mt-6">
            <ReviewsTab productId={productId} variantId={variantId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

