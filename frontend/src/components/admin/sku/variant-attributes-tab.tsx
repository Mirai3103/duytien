import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface VariantAttributesTabProps {
  productId: number;
  variantId: number;
  variant: any;
}

// Define types for better type safety
interface AttributeValue {
  attributeId: number;
  value: string;
}

interface RequiredAttribute {
  productId: number;
  attributeId: number;
  defaultValue: string | null;
  attribute: {
    id: number;
    name: string;
  };
}

interface VariantValue {
  value?: {
    attributeId: number;
    value: string;
  };
}

// Create dynamic schema based on required attributes
const createAttributesSchema = (requiredAttrs: RequiredAttribute[]) => {
  const schemaShape: Record<string, z.ZodString> = {};
  
  requiredAttrs.forEach((attr) => {
    schemaShape[`attr_${attr.attributeId}`] = z
      .string()
      .min(1, `${attr.attribute.name} là bắt buộc`)
      .trim();
  });

  return z.object(schemaShape);
};

export function VariantAttributesTab({
  productId,
  variantId,
  variant,
}: VariantAttributesTabProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: requiredAttrs = [] } = useQuery(
    trpc.attributes.getKeyByProductId.queryOptions(productId)
  );

  // Create form schema dynamically
  const formSchema = createAttributesSchema(requiredAttrs);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Initialize form values when variant or requiredAttrs change
  useEffect(() => {
    if (!variant || !Array.isArray(requiredAttrs) || requiredAttrs.length === 0) {
      return;
    }

    const variantValues = (variant.variantValues || []) as VariantValue[];
    const initialValues: Record<string, string> = {};

    requiredAttrs.forEach((ra) => {
      const existingValue = variantValues.find(
        (vv) => vv.value?.attributeId === ra.attributeId
      );
      initialValues[`attr_${ra.attributeId}`] = existingValue?.value?.value || "";
    });

    form.reset(initialValues);
  }, [variant, requiredAttrs, form]);

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.variants.getVariants.queryKey(productId),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.variants.getVariantDetail.queryKey(variantId),
      }),
    ]);
  };

  const mutateSetAttrs = useMutation(
    trpc.variants.setVariantAttributes.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật thuộc tính thành công");
        await invalidate();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi cập nhật thuộc tính");
        console.error(error);
      },
    })
  );

  const onSubmit = (data: FormValues) => {
    const attributeValues: AttributeValue[] = requiredAttrs
      .map((ra) => ({
        attributeId: ra.attributeId,
        value: data[`attr_${ra.attributeId}`]?.trim() || "",
      }))
      .filter((av) => av.value.length > 0);

    mutateSetAttrs.mutate({
      variantId,
      attributeValues,
    });
  };

  const hasRequiredAttrs = Array.isArray(requiredAttrs) && requiredAttrs.length > 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Giá trị thuộc tính</CardTitle>
        </div>
        <CardDescription>
          Nhập giá trị cụ thể cho các thuộc tính của biến thể này
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {hasRequiredAttrs ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {requiredAttrs.map((ra) => (
                  <FormField
                    key={ra.attributeId}
                    control={form.control}
                    name={`attr_${ra.attributeId}` as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid md:grid-cols-[200px_1fr_100px] gap-4 items-start p-4 border rounded-lg bg-muted/30">
                          <div>
                            <FormLabel className="font-medium text-sm">
                              {ra.attribute.name}
                            </FormLabel>
                            <FormDescription className="text-xs mt-1">
                              Thuộc tính bắt buộc
                            </FormDescription>
                          </div>
                          <div className="space-y-2">
                            <FormControl>
                              <Input
                                placeholder={ra.defaultValue || "Nhập giá trị"}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                            Bắt buộc
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Nhớ lưu thuộc tính sau khi thay đổi
                </p>
                <Button
                  type="submit"
                  disabled={mutateSetAttrs.isPending || !form.formState.isValid}
                  size="lg"
                >
                  {mutateSetAttrs.isPending ? "Đang lưu..." : "Lưu thuộc tính"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Không có thuộc tính bắt buộc cho sản phẩm này</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
