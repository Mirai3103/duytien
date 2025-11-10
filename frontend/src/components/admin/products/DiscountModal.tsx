import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc";

const discountSchema = z
  .object({
    type: z.enum(["percentage", "fixed"], {
      required_error: "Vui lòng chọn loại khuyến mãi",
    }),
    value: z.coerce
      .number({
        required_error: "Vui lòng nhập giá trị",
        invalid_type_error: "Giá trị phải là số",
      })
      .min(0, "Giá trị phải lớn hơn hoặc bằng 0")
      .refine((val) => val >= 0, {
        message: "Giá trị không hợp lệ",
      }),
  })
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.value >= 0 && data.value <= 100;
      }
      return data.value >= 0;
    },
    {
      message: "Giá trị không hợp lệ",
      path: ["value"],
    }
  );

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
  productPrice: number;
  currentDiscount?: string | null;
}

export function DiscountModal({
  open,
  onOpenChange,
  productId,
  productName,
  productPrice,
  currentDiscount,
}: DiscountModalProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse current discount if exists
  const getDefaultValues = (): DiscountFormValues => {
    if (currentDiscount) {
      const discount = parseFloat(currentDiscount);
      // Heuristic: if discount < 1, it's likely a percentage (0.1 = 10%)
      // if discount >= 1, it could be either but we assume fixed amount
      // Better approach: store discount type in metadata
      if (discount > 0 && discount < 1) {
        return { type: "percentage", value: discount * 100 };
      }
      return { type: "fixed", value: discount };
    }
    return { type: "percentage", value: 0 };
  };

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: getDefaultValues(),
  });
  const value = form.watch("value");
  const mutateDiscount = useMutation(
    trpc.products.setDiscount.mutationOptions({
      onSuccess: () => {
        toast.success("Cập nhật khuyến mãi thành công");
        queryClient.invalidateQueries(
          trpc.products.getProducts.queryOptions as any
        );
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error("Cập nhật khuyến mãi thất bại");
        console.error(error);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    })
  );

  const onSubmit = (data: DiscountFormValues) => {
    setIsSubmitting(true);

    // Convert to the format backend expects
    let discountValue = data.value;
    if (data.type === "percentage") {
      // Convert percentage to decimal (10% -> 0.1)
      discountValue = data.value / 100;
      // Validate percentage range
      if (data.value > 100) {
        form.setError("value", {
          message: "Phần trăm không thể vượt quá 100%",
        });
        setIsSubmitting(false);
        return;
      }
    } else {
      // Validate fixed amount doesn't exceed product price
      if (data.value > productPrice) {
        form.setError("value", {
          message: `Giá trị giảm không thể vượt quá giá sản phẩm (${productPrice.toLocaleString("vi-VN")}₫)`,
        });
        setIsSubmitting(false);
        return;
      }
    }

    mutateDiscount.mutate({
      productId,
      discount: discountValue,
    });
  };

  const type = form.watch("type");

  // Calculate preview price
  const getDiscountedPrice = () => {
    if (!value || value <= 0) return productPrice;

    if (type === "percentage") {
      return productPrice - (productPrice * value) / 100;
    }
    return productPrice - value;
  };

  const discountedPrice = getDiscountedPrice();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật khuyến mãi</DialogTitle>
          <DialogDescription>
            Thiết lập khuyến mãi cho sản phẩm: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Warning Alert */}
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Lưu ý</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Giá giảm sẽ được áp dụng cho{" "}
                <strong>tất cả các biến thể</strong> (variants/SKU) của sản phẩm
                này. Vui lòng kiểm tra kỹ trước khi lưu.
              </AlertDescription>
            </Alert>

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại khuyến mãi</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại khuyến mãi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định (₫)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá trị {type === "percentage" ? "(%)" : "(₫)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        type === "percentage"
                          ? "Nhập phần trăm (0-100)"
                          : "Nhập số tiền"
                      }
                      min="0"
                      step={type === "percentage" ? "0.01" : "1000"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {type === "percentage"
                      ? "Nhập giá trị từ 0 đến 100"
                      : `Nhập số tiền giảm (tối đa ${productPrice.toLocaleString("vi-VN")}₫)`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Preview */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá gốc:</span>
                  <span className="font-medium">
                    {productPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                {value > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      <span className="text-red-600 font-medium">
                        {type === "percentage"
                          ? `${value}%`
                          : `${value.toLocaleString("vi-VN")}₫`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base border-t pt-2">
                      <span className="font-semibold">Giá sau giảm:</span>
                      <span className="font-bold text-primary">
                        {Math.max(0, discountedPrice).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu khuyến mãi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
