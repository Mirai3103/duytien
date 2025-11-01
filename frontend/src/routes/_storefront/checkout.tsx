import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  Wallet,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressDialog, type Address } from "@/components/user/address-dialog";

export const Route = createFileRoute("/_storefront/checkout")({
  component: RouteComponent,
});

interface FormData {
  email: string;
  note: string;
}

function RouteComponent() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const { selectedIds } = useCartStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: cartItems } = useQuery(
    trpc.cart.getCartItemsInIds.queryOptions(selectedIds, {
      enabled: selectedIds.length > 0,
    })
  );

  // Load user addresses
  const { data: addresses = [] } = useQuery(
    trpc.addresses.getAddresses.queryOptions()
  );

  // Mutation to create address
  const createAddressMutation = useMutation({
    ...trpc.addresses.createAddress.mutationOptions(),
    onSuccess: async (newAddressId) => {
      await queryClient.invalidateQueries({
        queryKey: trpc.addresses.getAddresses.queryOptions().queryKey,
      });
      // Select the newly created address - will be handled by the next addresses update
      setSelectedAddressId(newAddressId);
    },
  });

  const [formData, setFormData] = useState<FormData>({
    email: "",
    note: "",
  });

  // Auto-select default address when addresses first load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.isDefault);
      if (defaultAddress) {
        handleSelectAddress({
          id: defaultAddress.id,
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          detail: defaultAddress.detail,
          ward: defaultAddress.ward,
          province: defaultAddress.province,
          note: defaultAddress.note || "",
          isDefault: defaultAddress.isDefault,
        });
      } else {
        // If no default, select the first one
        handleSelectAddress({
          id: addresses[0].id,
          fullName: addresses[0].fullName,
          phone: addresses[0].phone,
          detail: addresses[0].detail,
          ward: addresses[0].ward,
          province: addresses[0].province,
          note: addresses[0].note || "",
          isDefault: addresses[0].isDefault,
        });
      }
    }
  }, [addresses.length]);

  // Auto-fill note from selected address
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
      if (selectedAddress && selectedAddress.note) {
        setFormData((prev) => ({
          ...prev,
          note: selectedAddress.note || prev.note, // Keep existing note if any
        }));
      }
    }
  }, [selectedAddressId, addresses]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subtotal =
    cartItems?.reduce<number>(
      (sum, item) => sum + Number(item.variant.price) * Number(item.quantity),
      0
    ) || 0;
  const discount = 0; // Can be calculated based on coupons
  const shippingFee =
    shippingMethod === "express"
      ? 50000
      : shippingMethod === "standard"
        ? 30000
        : 0;
  const total = subtotal - discount + shippingFee;

  // Handle address selection
  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  // Handle save new address
  const handleSaveAddress = async (
    addressData: Omit<Address, "id"> & { id?: number }
  ) => {
    await createAddressMutation.mutateAsync({
      fullName: addressData.fullName,
      phone: addressData.phone,
      detail: addressData.detail,
      ward: addressData.ward,
      province: addressData.province,
      note: addressData.note || "",
      isDefault: addressData.isDefault,
    });
    setAddressDialogOpen(false);
  };

  const isFormValid = () => {
    return selectedAddressId;
  };

  const handleSubmitOrder = () => {
    if (!isFormValid()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    // Handle order submission
    console.log("Order submitted", { formData, paymentMethod, shippingMethod });
    alert("Đặt hàng thành công! (Demo)");
  };
  if (selectedIds.length === 0) {
    return redirect({ to: "/cart" });
  }

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
              {/* Shipping Address - Select from saved addresses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Địa chỉ giao hàng
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddressDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() =>
                            handleSelectAddress({
                              id: address.id,
                              fullName: address.fullName,
                              phone: address.phone,
                              detail: address.detail,
                              ward: address.ward,
                              province: address.province,
                              note: address.note || "",
                              isDefault: address.isDefault,
                            })
                          }
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">
                                  {address.fullName}
                                </p>
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Mặc định
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {address.phone}
                              </p>
                              <p className="text-sm">
                                {address.detail}, {address.ward},{" "}
                                {address.province}
                              </p>
                              {address.note && (
                                <p className="text-sm text-muted-foreground italic mt-1">
                                  Ghi chú: {address.note}
                                </p>
                              )}
                            </div>
                            {selectedAddressId === address.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa có địa chỉ nào
                      </p>
                      <Button onClick={() => setAddressDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa chỉ đầu tiên
                      </Button>
                    </div>
                  )}

                  {/* Email and note fields */}
                  {selectedAddressId && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="note">
                          Ghi chú đơn hàng (không bắt buộc)
                        </Label>
                        <Textarea
                          id="note"
                          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                          rows={3}
                          value={formData.note}
                          onChange={(e) =>
                            updateFormData("note", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Method */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Phương thức vận chuyển
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="free" id="free" />
                          <Label htmlFor="free" className="cursor-pointer">
                            <div>
                              <p className="font-semibold">
                                Miễn phí vận chuyển
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Giao hàng trong 5-7 ngày
                              </p>
                            </div>
                          </Label>
                        </div>
                        <span className="font-semibold text-green-600">
                          Miễn phí
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="cursor-pointer">
                            <div>
                              <p className="font-semibold">
                                Giao hàng tiêu chuẩn
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Giao hàng trong 2-3 ngày
                              </p>
                            </div>
                          </Label>
                        </div>
                        <span className="font-semibold">30,000đ</span>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="cursor-pointer">
                            <div>
                              <p className="font-semibold">Giao hàng nhanh</p>
                              <p className="text-sm text-muted-foreground">
                                Giao hàng trong 24 giờ
                              </p>
                            </div>
                          </Label>
                        </div>
                        <span className="font-semibold">50,000đ</span>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card> */}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-3">
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

                  {paymentMethod === "bank" && (
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

                  {/* Summary Calculations */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">
                        {subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-medium">
                          -{discount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển
                      </span>
                      <span className="font-medium">
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          `${shippingFee.toLocaleString("vi-VN")}đ`
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
                  </div>

                  {/* Place Order Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={!isFormValid()}
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
        onSave={handleSaveAddress}
      />
    </div>
  );
}
