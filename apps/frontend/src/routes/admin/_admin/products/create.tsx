import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import ProductForm from "@/components/admin/product/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Thêm sản phẩm</h1>
        <Link to="/admin/products" className="text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            submitLabel="Tạo mới"
            loading={mutateCreate.isPending}
            onSubmit={(values) => mutateCreate.mutate(values as any)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
