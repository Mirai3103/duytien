import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  Wallet,
  Tag,
  Calendar,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressDialog, type Address } from "@/components/user/address-dialog";
import { AddressSelection } from "@/components/checkout/address-selection";
import { toast } from "sonner";
import { getFinalPrice } from "@/lib/utils";

export const Route = createFileRoute("/_storefront/checkout")({
  component: RouteComponent,
});

export interface CheckoutFormData {
  selectedAddressId: number | null;
  paymentMethod: "cod" | "momo" | "vnpay" | "bank";
  note: string;
  // Manual address entry fields
  manualFullName: string;
  manualPhone: string;
  manualProvince: string;
  manualWard: string;
  manualDetail: string;
  manualNote: string;
  // Installment fields
  identityId: string;
  fullName: string;
  installmentCount: number;
}

function RouteComponent() {
  const { selectedIds,voucherCode } = useCartStore();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Address dialog state
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  // Use saved address toggle
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  // Installment toggle
  const [isInstallment, setIsInstallment] = useState(false);
  const { data: voucher = null } = useQuery(trpc.vouchers.getVoucherByCode.queryOptions({ code: voucherCode || "" },{
    enabled: !!voucherCode,
  }));

  // React Hook Form setup
  const { control, handleSubmit, watch, setValue } = useForm<CheckoutFormData>({
    defaultValues: {
      selectedAddressId: null,
      paymentMethod: "cod",
      note: "",
      manualFullName: "",
      manualPhone: "",
      manualProvince: "",
      manualWard: "",
      manualDetail: "",
      manualNote: "",
      identityId: "",
      fullName: "",
      installmentCount: 6,
    },
    mode: "onChange",
  });

  const selectedAddressId = watch("selectedAddressId");
  const installmentCount = watch("installmentCount");
  const paymentMethod = watch("paymentMethod");

  const { data: cartItems } = useQuery(
    trpc.cart.getCartItemsInIds.queryOptions(selectedIds, {
      enabled: selectedIds.length > 0,
    })
  );
  const navigate = useNavigate();

  // Load user addresses
  const { data: addresses = [] } = useQuery(
    trpc.addresses.getAddresses.queryOptions()
  );

  // Load provinces for manual entry
  const { data: provinces = [] } = useQuery(
    trpc.addresses.getProvinces.queryOptions()
  );

  // Load wards when province is selected in manual entry
  const manualProvince = watch("manualProvince");
  const { data: wards = [] } = useQuery(
    trpc.addresses.getWards.queryOptions(
      { provinceCode: manualProvince },
      { enabled: !!manualProvince && !useSavedAddress }
    )
  );

  // Mutation to create address
  const createAddressMutation = useMutation(
    trpc.addresses.createAddress.mutationOptions({
      onSuccess: async (newAddressId) => {
        await queryClient.invalidateQueries(
          trpc.addresses.getAddresses.queryOptions()
        );
        // Select the newly created address
        setValue("selectedAddressId", newAddressId, { shouldValidate: true });
        toast.success("Thêm địa chỉ thành công!");
      },
    })
  );

  // Mutation to update address
  const updateAddressMutation = useMutation(
    trpc.addresses.updateAddress.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.addresses.getAddresses.queryOptions()
        );
        toast.success("Cập nhật địa chỉ thành công!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật địa chỉ");
      },
    })
  );
  const createOrderMutation = useMutation(
    trpc.orders.createOrder.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.cart.getCartItemsInIds.queryOptions(selectedIds)
        );
        await queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
        await queryClient.invalidateQueries(
          trpc.cart.countCartItems.queryOptions()
        );
        if(data?.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          navigate({ to: "/", replace: true });
        }
        router.invalidate();

      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // Auto-select default address when addresses first load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.isDefault);
      const addressToSelect = defaultAddress || addresses[0];
      const timeOut = setTimeout(() => {
        if (addressToSelect) {
          setValue("selectedAddressId", addressToSelect.id);
          // Auto-fill note from address
          if (addressToSelect.note) {
            setValue("note", addressToSelect.note);
          }
        }
      }, 2000); // 1s delay to prevent flashing
      return () => clearTimeout(timeOut);
    }
  }, [addresses, selectedAddressId, setValue]);

  const subtotal =
    cartItems?.reduce<number>(
      (sum, item) => sum + getFinalPrice(Number(item.variant.price), Number(item.variant.product?.discount || 0)) * Number(item.quantity),
      0
    ) || 0;
  
  // Calculate discount from voucher
  const reducePrice = React.useMemo(() => {
    if (!voucher) return 0;
    
    if (voucher.type === "percentage") {
      const percentDiscount = (subtotal * Number(voucher.discount)) / 100;
   
      const reducePrice = subtotal - percentDiscount;
      return Math.min(reducePrice, Number(voucher.maxDiscount || Infinity));
    } else {
      const reducePrice = subtotal - Number(voucher.discount);
      return Math.min(reducePrice, Number(voucher.maxDiscount || Infinity));
    }
  }, [voucher, subtotal]);
  
  const shippingFee = 0;
  const total = subtotal - reducePrice + shippingFee;
  
  // Calculate installment amount and round up to nearest 1000
  const installmentAmount = isInstallment && installmentCount > 0 
    ? Math.ceil(total / installmentCount / 1000) * 1000
    : total;

  // Handle address selection
  const handleSelectAddress = (address: Address) => {
    setValue("selectedAddressId", address.id, { shouldValidate: true });
    // Auto-fill note from selected address
  };

  // Handle save new address
  const handleSaveAddress = async (
    addressData: Omit<Address, "id"> & { id?: number }
  ) => {
    if (addressData.id) {
      // Update existing address
      await updateAddressMutation.mutateAsync({
        id: addressData.id,
        fullName: addressData.fullName,
        phone: addressData.phone,
        detail: addressData.detail,
        ward: addressData.ward,
        province: addressData.province,
        note: addressData.note || "",
        isDefault: addressData.isDefault,
      });
    } else {
      // Create new address
      await createAddressMutation.mutateAsync({
        fullName: addressData.fullName,
        phone: addressData.phone,
        detail: addressData.detail,
        ward: addressData.ward,
        province: addressData.province,
        note: addressData.note || "",
        isDefault: addressData.isDefault,
      });
    }
    setAddressDialogOpen(false);
    setEditingAddress(undefined);
  };

  // Handle add new address
  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setAddressDialogOpen(true);
  };

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };
  const router = useRouter();

  // Form submission handler
  const onSubmit = async (data: CheckoutFormData) => {
    let shippingAddressId = data.selectedAddressId;

    // If manual entry mode, create a hidden address first
    if (!useSavedAddress) {
      // Validate manual entry fields
      if (!data.manualFullName || !data.manualPhone || !data.manualProvince || 
          !data.manualWard || !data.manualDetail) {
        toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
        return;
      }

      try {
        // Get province name from code
        const selectedProvince = provinces.find(p => p.code === data.manualProvince);
        const provinceName = selectedProvince?.name || data.manualProvince;

        // Create hidden address
        shippingAddressId = await createAddressMutation.mutateAsync({
          fullName: data.manualFullName,
          phone: data.manualPhone,
          province: provinceName,
          ward: data.manualWard,
          detail: data.manualDetail,
          note: data.manualNote || "",
          isDefault: false,
          isHidden: true, // This is a hidden address
        });
      } catch (error) {
        toast.error("Không thể tạo địa chỉ giao hàng");
        return;
      }
    }

    // Validate address is selected
    if (!shippingAddressId) {
      toast.error("Vui lòng chọn hoặc nhập địa chỉ giao hàng");
      return;
    }

    // Handle order submission
    console.log("Order submitted", {
      ...data,
      cartItems,
      total,
      shippingAddressId,
    });
    
    // Validate installment fields if installment mode is on
    if (isInstallment) {
      if (!data.identityId || !data.fullName) {
        toast.error("Vui lòng điền đầy đủ thông tin CCCD và họ tên cho trả góp");
        return;
      }
      if (!data.installmentCount || data.installmentCount < 1) {
        toast.error("Vui lòng chọn kỳ hạn trả góp");
        return;
      }
    }

    await createOrderMutation.mutateAsync({
      cartItems: selectedIds,
      shippingAddressId: shippingAddressId,
      note: data.note,
      paymentMethod: data.paymentMethod as "cod" | "momo" | "vnpay",
      voucherId: voucher?.id || undefined,
      payType: isInstallment ? "partial" : "full",
      installmentCount: isInstallment ? data.installmentCount : undefined,
      identityId: isInstallment ? data.identityId : undefined,
      fullName: isInstallment ? data.fullName : undefined,
    });
    toast.success("Đặt hàng thành công");
  };
  console.log("reducePrice", reducePrice);
  React.useEffect(() => {
    if (selectedIds.length === 0) {
      navigate({ to: "/cart", replace: true });
    }
  }, [selectedIds, navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/cart" className="hover:text-primary">
              Giỏ hàng
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Thanh toán</span>
          </div>

          <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address - Select from saved addresses or manual entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressSelection
                    control={control}
                    setValue={setValue}
                    addresses={addresses}
                    provinces={provinces}
                    wards={wards}
                    selectedAddressId={selectedAddressId}
                    useSavedAddress={useSavedAddress}
                    onUseSavedAddressChange={setUseSavedAddress}
                    onSelectAddress={handleSelectAddress}
                    onEditAddress={handleEditAddress}
                    onAddAddress={handleAddAddress}
                    isCreating={createAddressMutation.isPending}
                    isUpdating={updateAddressMutation.isPending}
                    manualProvince={manualProvince}
                  />

                  {/* Order Note field - shown for both modes */}
                  {(selectedAddressId || !useSavedAddress) && (
                    <div className="space-y-4 pt-4 mt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="note">
                          Ghi chú đơn hàng (không bắt buộc)
                        </Label>
                        <Controller
                          name="note"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id="note"
                              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                              rows={3}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Phương thức thanh toán
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="installment-toggle" className="text-sm font-normal cursor-pointer">
                        Trả góp
                      </Label>
                      <Switch
                        id="installment-toggle"
                        checked={isInstallment}
                        onCheckedChange={(checked) => {
                          setIsInstallment(checked);
                          // Change payment method to momo if COD is selected
                          if (checked && paymentMethod === "cod") {
                            setValue("paymentMethod", "momo");
                          }
                        }}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Installment Form */}
                  {isInstallment && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                              Thông tin trả góp
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Vui lòng điền đầy đủ thông tin để sử dụng dịch vụ trả góp
                            </p>
                          </div>

                          {/* Identity ID Field */}
                          <div className="space-y-2">
                            <Label htmlFor="identityId">
                              Số CCCD/CMND <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="identityId"
                              control={control}
                              rules={{ required: isInstallment }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="identityId"
                                  placeholder="Nhập số CCCD/CMND"
                                  className="bg-white dark:bg-gray-950"
                                />
                              )}
                            />
                          </div>

                          {/* Full Name Field */}
                          <div className="space-y-2">
                            <Label htmlFor="fullName">
                              Họ và tên (đầy đủ) <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="fullName"
                              control={control}
                              rules={{ required: isInstallment }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="fullName"
                                  placeholder="Nhập họ và tên đầy đủ"
                                  className="bg-white dark:bg-gray-950"
                                />
                              )}
                            />
                          </div>

                          {/* Installment Count Select */}
                          <div className="space-y-2">
                            <Label htmlFor="installmentCount">
                              Kỳ hạn trả góp <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="installmentCount"
                              control={control}
                              rules={{ required: isInstallment }}
                              render={({ field }) => (
                                <Select
                                  value={field.value?.toString()}
                                  onValueChange={(value) => field.onChange(Number(value))}
                                >
                                  <SelectTrigger className="bg-white dark:bg-gray-950">
                                    <SelectValue placeholder="Chọn kỳ hạn" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="6">6 tháng</SelectItem>
                                    <SelectItem value="12">12 tháng</SelectItem>
                                    <SelectItem value="18">18 tháng</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          {/* Installment Info */}
                          {installmentCount > 0 && (
                            <div className="p-3 bg-white dark:bg-gray-950 border border-blue-200 dark:border-blue-800 rounded-md">
                              <p className="text-sm text-muted-foreground mb-1">
                                Số tiền mỗi kỳ:
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {installmentAmount.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Thanh toán {installmentCount} kỳ, mỗi tháng một lần
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <Controller
                    name="paymentMethod"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="space-y-3">
                          {/* Hide COD when installment is enabled */}
                          {!isInstallment && (
                            <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="font-semibold">
                                        Thanh toán khi nhận hàng (COD)
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Thanh toán bằng tiền mặt khi nhận hàng
                                      </p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <Badge variant="secondary">Phổ biến</Badge>
                            </div>
                          )}
                          {/* 
                      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-semibold">
                                  Chuyển khoản ngân hàng
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Chuyển khoản trực tiếp qua ngân hàng
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div> */}

                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="momo" id="momo" />
                              <Label htmlFor="momo" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    M
                                  </div>
                                  <div>
                                    <p className="font-semibold">Ví MoMo</p>
                                    <p className="text-sm text-muted-foreground">
                                      Thanh toán qua ví điện tử MoMo
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="vnpay" id="vnpay" />
                              <Label htmlFor="vnpay" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="font-semibold">VNPAY</p>
                                    <p className="text-sm text-muted-foreground">
                                      Thanh toán qua cổng VNPAY
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {watch("paymentMethod") === "bank" && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                      <p className="font-semibold">Thông tin chuyển khoản:</p>
                      <div className="text-sm space-y-1">
                        <p>
                          Ngân hàng:{" "}
                          <span className="font-semibold">Vietcombank</span>
                        </p>
                        <p>
                          Số tài khoản:{" "}
                          <span className="font-semibold">1234567890</span>
                        </p>
                        <p>
                          Chủ tài khoản:{" "}
                          <span className="font-semibold">
                            CÔNG TY TNHH ABC
                          </span>
                        </p>
                        <p>
                          Nội dung:{" "}
                          <span className="font-semibold">
                            Họ tên + Số điện thoại
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems?.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                            <img
                              src={item.variant.image!}
                              alt={item.variant.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {item.variant.name}
                          </h4>
                          {item.variant.variantValues.map((value) => (
                            <Badge
                              key={value.attributeValueId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {value.value.value}
                            </Badge>
                          ))}
                          <p className="text-sm font-semibold text-primary mt-2">
                            {(
                              Number(item.variant.price) * Number(item.quantity)
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Voucher Info */}
                  {voucher && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600 text-sm">
                          {voucher.name}
                        </span>
                      </div>
                      {voucher.maxDiscount && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 mb-2 text-green-700 border-green-300 text-xs"
                          >
                            {`Tối đa ${Number(voucher.maxDiscount).toLocaleString("vi-VN")}đ`}
                          </Badge>
                        )}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 border-green-300 text-xs"
                        >
                          {voucher.type === "percentage"
                            ? `${voucher.discount}%`
                            : `${Number(voucher.discount).toLocaleString("vi-VN")}đ`}
                        </Badge>
                      
                        <span className="text-xs text-muted-foreground">
                          Mã: {voucher.code}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Summary Calculations */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">
                        {subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {reducePrice > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá {voucher && `(${voucher.code})`}</span>
                        <span className="font-medium">
                          -{reducePrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển
                      </span>
                      <span className="font-medium">
                        {shippingFee === 0 && (
                          <span className="text-green-600">Miễn phí</span>
                        )}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        {total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {/* Installment Summary */}
                    {isInstallment && installmentCount > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                            Thông tin trả góp
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700 dark:text-blue-300">
                              Số tiền mỗi kỳ:
                            </span>
                            <span className="font-bold text-blue-600">
                              {installmentAmount.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700 dark:text-blue-300">
                              Số kỳ:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {installmentCount} tháng
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700 dark:text-blue-300">
                              Thanh toán lần đầu:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {installmentAmount.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                          * Các kỳ tiếp theo sẽ được thanh toán mỗi tháng một lần
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Place Order Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit(onSubmit)}
                    disabled={
                      (useSavedAddress && !selectedAddressId) ||
                      createOrderMutation.isPending
                    }
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Đặt hàng
                  </Button>

                  <Link to="/cart">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại giỏ hàng
                    </Button>
                  </Link>

                  {/* Security Info */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Thông tin thanh toán được bảo mật</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Miễn phí đổi trả trong 7 ngày</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Bảo hành chính hãng toàn quốc</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Address Dialog */}

      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
