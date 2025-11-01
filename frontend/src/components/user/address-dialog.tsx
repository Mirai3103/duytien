import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { type Province, type Commune } from "@/lib/address";
import { Loader2 } from "lucide-react";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

// Match backend schema
export interface Address {
  id: number;
  fullName: string;
  phone: string;
  detail: string;
  ward: string;
  province: string;
  note?: string;
  isDefault: boolean;
}

// Zod validation schema
const addressSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  detail: z.string().min(1, "Vui lòng nhập địa chỉ"),
  ward: z.string().min(1, "Vui lòng nhập phường/xã"),
  province: z.string().min(1, "Vui lòng nhập tỉnh/thành phố"),
  note: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSave: (address: Omit<Address, "id"> & { id?: number }) => void;
}

export function AddressDialog({
  open,
  onOpenChange,
  address,
  onSave,
}: AddressDialogProps) {
  const trpc = useTRPC();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      fullName: "",
      phone: "",
      detail: "",
      ward: "",
      province: "",
      note: "",
      isDefault: false,
    },
  });

  // Query to get provinces
  const {
    data: provinces = [],
    isLoading: loadingProvinces,
  } = useQuery({
    ...trpc.addresses.getProvinces.queryOptions(),
    enabled: open, // Only fetch when dialog is open
  });

  // Query to get wards based on selected province
  const {
    data: wards = [],
    isLoading: loadingWards,
  } = useQuery({
    ...trpc.addresses.getWards.queryOptions({
      provinceCode: selectedProvinceCode,
    }),
    enabled: !!selectedProvinceCode, // Only fetch when province is selected
  });

  // Reset ward when province changes
  useEffect(() => {
    if (selectedProvinceCode) {
      form.setValue("ward", "");
    }
  }, [selectedProvinceCode, form]);

  useEffect(() => {
    if (address) {
      form.reset({
        fullName: address.fullName,
        phone: address.phone,
        detail: address.detail,
        ward: address.ward,
        province: address.province,
        note: address.note || "",
        isDefault: address.isDefault,
      });

      // Set province code for loading wards
      const province = provinces.find((p) => p.name === address.province);
      if (province) {
        setSelectedProvinceCode(province.code);
      }
    } else {
      form.reset({
        fullName: "",
        phone: "",
        detail: "",
        ward: "",
        province: "",
        note: "",
        isDefault: false,
      });
      setSelectedProvinceCode("");
    }
  }, [address, open, form, provinces]);

  const onSubmit = (data: AddressFormValues) => {
    onSave({
      ...data,
      id: address?.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin địa chỉ giao hàng của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nguyễn Văn A" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0123456789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Số nhà, tên đường" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const province = provinces.find((p) => p.name === value);
                          if (province) {
                            setSelectedProvinceCode(province.code);
                          }
                        }}
                        value={field.value}
                        disabled={loadingProvinces}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingProvinces ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            provinces.map((province) => (
                              <SelectItem key={province.code} value={province.name}>
                                {province.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phường/Xã</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedProvinceCode || loadingWards}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedProvinceCode
                                  ? "Chọn tỉnh trước"
                                  : loadingWards
                                  ? "Đang tải..."
                                  : "Chọn phường/xã"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingWards ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            wards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.name}>
                                {ward.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ví dụ: Gọi trước khi giao hàng..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu địa chỉ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
