import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package2,
  Box,
  Images,
  Tag,
  FileText,
} from "lucide-react";
import { VariantSpecsTab } from "@/components/admin/variant/VariantSpecsTab";
import { VariantInfoTab } from "@/components/admin/sku/variant-info-tab";
import { VariantGalleryTab } from "@/components/admin/sku/variant-gallery-tab";
import { VariantAttributesTab } from "@/components/admin/sku/variant-attributes-tab";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn-io/tabs";

export const Route = createFileRoute(
  "/admin/_admin/products/$id/variants/$variantId/edit"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({
    from: "/admin/_admin/products/$id/variants/$variantId/edit",
  });
  const productId = Number(params.id);
  const variantId = Number(params.variantId);
  const router = useRouter();
  const trpc = useTRPC();

  const { data: variant } = useQuery(
    trpc.variants.getVariantDetail.queryOptions(variantId)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.navigate({
                to: "/admin/products/$id/variants",
                params: { id: String(productId) },
              })
            }
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Package2 className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa biến thể (SKU)
            </h1>
            <p className="text-muted-foreground mt-1">
              Cập nhật thông tin chi tiết của biến thể sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="info" className="gap-2">
            <Box className="h-4 w-4" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Images className="h-4 w-4" />
            Thư viện ảnh
          </TabsTrigger>
          <TabsTrigger value="attributes" className="gap-2">
            <Tag className="h-4 w-4" />
            Thuộc tính
          </TabsTrigger>
          <TabsTrigger value="specs" className="gap-2">
            <FileText className="h-4 w-4" />
            Thông số
          </TabsTrigger>
        </TabsList>
        <TabsContents>
          {/* Info Tab */}
          <TabsContent value="info">
            <VariantInfoTab
              productId={productId}
              variantId={variantId}
              variant={variant}
            />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <VariantGalleryTab
              productId={productId}
              variantId={variantId}
              variant={variant}
            />
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes">
            <VariantAttributesTab
              productId={productId}
              variantId={variantId}
              variant={variant}
            />
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs">
            <VariantSpecsTab variantId={variantId} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
