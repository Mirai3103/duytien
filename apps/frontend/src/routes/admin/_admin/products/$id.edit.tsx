import {
  createFileRoute,
  useParams,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import ProductForm from "@/components/admin/product/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useId, useState } from "react";

export const Route = createFileRoute("/admin/_admin/products/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/admin/_admin/products/$id/edit" });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const productId = Number(id);

  const { data: product } = useQuery(
    trpc.products.getProductDetail.queryOptions(productId)
  );

  const mutateUpdate = useMutation(
    trpc.products.updateProduct.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật sản phẩm thành công");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.products.getProducts.queryKey({
              page: 1,
              limit: 10,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.products.getProductDetail.queryKey(productId),
          }),
        ]);
        router.navigate({ to: "/admin/products" });
      },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa sản phẩm</h1>
        <Link to="/admin/products" className="text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="attrs">Thuộc tính biến thể</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                initialValues={product as any}
                submitLabel="Cập nhật"
                loading={mutateUpdate.isPending}
                onSubmit={(values) =>
                  mutateUpdate.mutate({ ...(values as any), id: productId })
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attrs">
          <AttributesTab productId={productId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AttributesTab({ productId }: { productId: number }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: required = [] } = useQuery(
    trpc.attributes.getKeyByProductId.queryOptions(productId)
  );
  const { data: allKeys = [] } = useQuery(
    trpc.attributes.getAllKeys.queryOptions()
  );

  const [attrName, setAttrName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const datalistId = useId();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.attributes.getKeyByProductId.queryKey(productId),
    });
  };

  const createMutation = useMutation(
    trpc.attributes.createProductRequiredAttribute.mutationOptions({
      onSuccess: async () => {
        await invalidate();
        setAttrName("");
        setDefaultValue("");
        toast.success("Thêm thuộc tính thành công");
      },
    })
  );
  const deleteMutation = useMutation(
    trpc.attributes.deleteProductRequiredAttribute.mutationOptions({
      onSuccess: async () => {
        await invalidate();
        toast.success("Xóa thuộc tính thành công");
      },
    })
  );

  const canAdd = attrName.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thuộc tính biến thể bắt buộc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Thuộc tính</label>
            <Input
              list={datalistId}
              value={attrName}
              onChange={(e) => setAttrName(e.target.value)}
              placeholder="Ví dụ: Màu sắc, Dung lượng..."
              className="mt-1"
            />
            <datalist id={datalistId}>
              {(Array.isArray(allKeys) ? allKeys : []).map((k: any) => (
                <option key={k.id} value={k.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              Giá trị mặc định
            </label>
            <Input
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="VD: Đen / 128GB"
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() =>
                createMutation.mutate({
                  productId,
                  attribute: attrName.trim(),
                  defaultValue: defaultValue.trim(),
                })
              }
              disabled={!canAdd || createMutation.isPending}
              className="w-full"
            >
              Thêm
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Thuộc tính</TableHead>
                <TableHead>Giá trị mặc định</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(Array.isArray(required) ? required : []).map(
                (r: any, idx: number) => (
                  <TableRow key={`${r.productId}-${r.attributeId}`}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{r.attribute?.name}</TableCell>
                    <TableCell>{r.defaultValue ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        className="text-red-600"
                        onClick={() =>
                          deleteMutation.mutate({
                            productId,
                            attributeId: Number(r.attributeId),
                          })
                        }
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
              {(!required || required.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Chưa có thuộc tính nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
