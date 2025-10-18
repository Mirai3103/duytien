import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Editor } from "@tiptap/core";
import { generateJSON, generateHTML } from "@tiptap/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  ProductStatus,
  type CreateProduct,
  type UpdateProduct,
} from "@f5tech/schemas/product";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import { uploadFile } from "@/lib/file";
import {
  extensions,
  SimpleEditor,
} from "@/components/tiptap-templates/simple/simple-editor";
import StarterKit from "@tiptap/starter-kit";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Info,
} from "lucide-react";

type ProductFormValues = Omit<CreateProduct, "createdAt" | "id">;

interface ProductFormProps {
  initialValues?: Partial<UpdateProduct>;
  submitLabel?: string;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}

export function ProductForm({
  initialValues,
  submitLabel = "Lưu",
  onSubmit,
  loading,
}: ProductFormProps) {
  const trpc = useTRPC();
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [originalThumbnail, setOriginalThumbnail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const descriptionEditorRef = useRef<Editor>(null);
  const { data: brands = [] as any[] } = useQuery(
    trpc.brands.getAll.queryOptions({ page: 1, limit: 500, search: "" })
  );
  const { data: parentCategories = [] as any[] } = useQuery(
    trpc.categories.getAllParentCategories.queryOptions()
  );

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      brandId: initialValues?.brandId ?? undefined,
      categoryId: initialValues?.categoryId ?? undefined,
      thumbnail: initialValues?.thumbnail ?? "",
      status: (initialValues?.status as ProductStatus) ?? ProductStatus.ACTIVE,
      price:
        typeof initialValues?.price === "number"
          ? initialValues!.price
          : Number(initialValues?.price ?? 0),
    },
  });

  useEffect(() => {
    form.reset({
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description
        ? generateJSON(initialValues!.description!, [StarterKit])
        : {},
      brandId: initialValues?.brandId ?? undefined,
      categoryId: initialValues?.categoryId ?? undefined,
      thumbnail: initialValues?.thumbnail ?? "",
      status: (initialValues?.status as ProductStatus) ?? ProductStatus.ACTIVE,
      price:
        typeof initialValues?.price === "number"
          ? initialValues!.price
          : Number(initialValues?.price ?? 0),
    });
    setThumbnailUrl(initialValues?.thumbnail ?? "");
    setOriginalThumbnail(initialValues?.thumbnail ?? "");
    setThumbnailFile(null);
  }, [initialValues, form]);
  const initialJsonContent = React.useMemo(() => {
    if (!initialValues?.description) return {};
    return generateJSON(initialValues?.description!, extensions);
  }, [initialValues?.description]);
  React.useEffect(() => {
    if (descriptionEditorRef.current && initialJsonContent) {
      descriptionEditorRef.current.commands.setContent(initialJsonContent);
    }
  }, [initialJsonContent]);

  const categoryOptions: { id: number; name: string }[] = (() => {
    const list: { id: number; name: string }[] = [];
    const parents = Array.isArray(parentCategories) ? parentCategories : [];
    for (const c of parents) {
      list.push({ id: Number(c.id), name: String(c.name) });
      const children = Array.isArray(c.children) ? c.children : [];
      for (const ch of children) {
        list.push({
          id: Number(ch.id),
          name: `${String(c.name)} / ${String(ch.name)}`,
        });
      }
    }
    return list;
  })();

  const brandOptions: { id: number; name: string }[] = (
    Array.isArray(brands) ? brands : []
  ).map((b: any) => ({ id: Number(b.id), name: String(b.name) }));

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(async (values) => {
          let finalThumbnail = values.thumbnail?.trim() || thumbnailUrl;
          if (thumbnailFile) {
            setIsUploading(true);
            try {
              finalThumbnail = await uploadFile(thumbnailFile);
            } finally {
              setIsUploading(false);
            }
          } else if (
            thumbnailFile === null &&
            originalThumbnail &&
            !thumbnailUrl.trim() &&
            !values.thumbnail?.trim()
          ) {
            finalThumbnail = "";
          }

          onSubmit({
            ...values,
            price: Number(values.price || 0),
            brandId: values.brandId ? Number(values.brandId) : undefined,
            categoryId: values.categoryId
              ? Number(values.categoryId)
              : undefined,
            thumbnail: finalThumbnail || undefined,
            description: generateHTML(
              descriptionEditorRef.current?.getJSON() ?? {},
              extensions
            ),
          });
        })}
      >
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: iPhone 15 Pro Max 256GB"
                    {...field}
                    required
                    className="text-base"
                  />
                </FormControl>
                <FormDescription>
                  Tên sản phẩm nên rõ ràng, mô tả đầy đủ về sản phẩm
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-base mb-3 block">
              Mô tả sản phẩm
            </FormLabel>
            <FormDescription className="mb-4">
              Mô tả chi tiết về sản phẩm, tính năng, thông số kỹ thuật
            </FormDescription>
            <div className="border rounded-lg overflow-hidden">
              <SimpleEditor
                ref={descriptionEditorRef}
                initialContent={initialJsonContent}
              />
            </div>
          </div>
        </div>

        {/* Categorization Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Phân loại & Trạng thái</h3>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thương hiệu</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Không chọn</SelectItem>
                      {brandOptions.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Thương hiệu của sản phẩm</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Không chọn</SelectItem>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Phân loại sản phẩm</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ProductStatus.ACTIVE}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value={ProductStatus.INACTIVE}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          Inactive
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Trạng thái hiển thị</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Giá bán</h3>
          </div>
          <Separator />

          <div className="max-w-md">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Giá sản phẩm (VNĐ)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      {...field}
                      className="text-base"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormDescription>
                    Giá bán cơ bản của sản phẩm (có thể thay đổi theo biến thể)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Hình ảnh</h3>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Ảnh đại diện sản phẩm
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <ImageUploadPreview
                      defaultValue={thumbnailUrl}
                      file={thumbnailFile}
                      onChange={(file) => setThumbnailFile(file)}
                      disabled={isUploading}
                      className="h-48"
                      imageClassName="h-48"
                    />
                    <Input
                      placeholder="Hoặc nhập URL ảnh: https://..."
                      value={field.value ?? thumbnailUrl}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setThumbnailUrl(e.target.value);
                      }}
                      className="max-w-2xl"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload ảnh hoặc nhập URL. Khuyến nghị: tỷ lệ 1:1, kích thước
                  tối thiểu 500x500px
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            Vui lòng kiểm tra kỹ thông tin trước khi lưu
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading || isUploading}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={loading || isUploading} size="lg">
              {loading || isUploading ? "Đang xử lý..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;
