import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

const voucherFormSchema = z.object({
  code: z.string().min(3, "Mã voucher phải có ít nhất 3 ký tự"),
  name: z.string().min(1, "Tên voucher không được để trống"),
  type: z.enum(["percentage", "fixed"], {
    required_error: "Vui lòng chọn loại voucher",
  }),
  discount: z.number().min(0, "Giá trị giảm phải lớn hơn 0"),
  maxDiscount: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxOrderAmount: z.number().min(0).optional(),
  maxUsage: z.number().int().min(0).optional(),
});

type VoucherFormData = z.infer<typeof voucherFormSchema>;

interface VoucherFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher?: any;
  mode: "create" | "edit";
}

export function VoucherFormModal({
  open,
  onOpenChange,
  voucher,
  mode,
}: VoucherFormModalProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "percentage",
      discount: 0,
      maxDiscount: undefined,
      minOrderAmount: undefined,
      maxOrderAmount: undefined,
      maxUsage: undefined,
    },
  });

  // Reset form when voucher changes or modal opens
  useEffect(() => {
    if (open) {
      if (voucher && mode === "edit") {
        form.reset({
          code: voucher.code,
          name: voucher.name || voucher.code,
          type: voucher.type,
          discount: Number(voucher.discount),
          maxDiscount: voucher.maxDiscount
            ? Number(voucher.maxDiscount)
            : undefined,
          minOrderAmount: voucher.minOrderAmount
            ? Number(voucher.minOrderAmount)
            : undefined,
          maxOrderAmount: voucher.maxOrderAmount
            ? Number(voucher.maxOrderAmount)
            : undefined,
          maxUsage: voucher.maxUsage || undefined,
        });
      } else {
        form.reset({
          code: "",
          name: "",
          type: "percentage",
          discount: 0,
          maxDiscount: undefined,
          minOrderAmount: undefined,
          maxOrderAmount: undefined,
          maxUsage: undefined,
        });
      }
    }
  }, [open, voucher, mode, form]);

  const createMutation = useMutation(
    trpc.vouchers.createVoucher.mutationOptions({
      onSuccess: () => {
        toast.success("Tạo voucher thành công");
        queryClient.invalidateQueries(
          trpc.vouchers.getVouchers.queryOptions({})
        );
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi tạo voucher");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.vouchers.updateVoucher.mutationOptions({
      onSuccess: () => {
        toast.success("Cập nhật voucher thành công");
        queryClient.invalidateQueries(
          trpc.vouchers.getVouchers.queryOptions({})
        );
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật voucher");
      },
    })
  );

  const onSubmit = (data: VoucherFormData) => {
    if (mode === "edit" && voucher) {
      updateMutation.mutate({ ...data, id: voucher.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo voucher mới" : "Chỉnh sửa voucher"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã voucher *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SUMMER2024"
                        {...field}
                        className="uppercase"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên voucher *</FormLabel>
                    <FormControl>
                      <Input placeholder="Giảm giá mùa hè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">
                          Phần trăm (%)
                        </SelectItem>
                        <SelectItem value="fixed">
                          Số tiền cố định (₫)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị giảm *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("type") === "percentage"
                        ? "Giá trị từ 0-100"
                        : "Số tiền giảm"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Max Discount (chỉ hiện khi type là percentage) */}
            {form.watch("type") === "percentage" && (
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm tối đa (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Số tiền giảm tối đa khi áp dụng phần trăm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Min Order Amount */}
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn tối thiểu (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Order Amount */}
              <FormField
                control={form.control}
                name="maxOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn tối đa (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Max Usage */}
            <FormField
              control={form.control}
              name="maxUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lần sử dụng tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Để trống nếu không giới hạn số lần sử dụng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Đang xử lý..."
                  : mode === "create"
                    ? "Tạo voucher"
                    : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
