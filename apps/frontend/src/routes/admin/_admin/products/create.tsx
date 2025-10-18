import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import ProductForm from "@/components/admin/product/ProductForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/_admin/products/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutateCreate = useMutation(
    trpc.products.createProduct.mutationOptions({
      onSuccess: async () => {
        toast.success("Tạo sản phẩm thành công");
        await queryClient.invalidateQueries({
          queryKey: trpc.products.getProducts.queryKey({ page: 1, limit: 10 }),
        });
        router.navigate({ to: "/admin/products" });
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi tạo sản phẩm");
        console.error(error);
      },
    })
  );

  return (
    <div className="container mx-auto max-w-6xl py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.navigate({ to: "/admin/products" })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Tạo sản phẩm mới
            </h1>
            <p className="text-muted-foreground mt-1">
              Điền thông tin chi tiết để thêm sản phẩm mới vào hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>
            Các trường đánh dấu <span className="text-red-500">*</span> là bắt
            buộc
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProductForm
            submitLabel="Tạo sản phẩm"
            loading={mutateCreate.isPending}
            onSubmit={(values) => mutateCreate.mutate(values as any)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
