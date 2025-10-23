import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_storefront/checkout")({
  component: RouteComponent,
});

const provinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  // Add more provinces as needed
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string;
}

function RouteComponent() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { selectedIds } = useCartStore();
  const trpc = useTRPC();
  const { data: cartItems } = useQuery(
    trpc.cart.getCartItemsInIds.queryOptions(selectedIds, {
      enabled: selectedIds.length > 0,
    })
  );
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

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

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.province &&
      formData.district &&
      formData.address
    );
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
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin người nhận
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Họ và tên <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="Nguyễn Văn A"
                          className="pl-10"
                          value={formData.fullName}
                          onChange={(e) =>
                            updateFormData("fullName", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Số điện thoại{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="0912345678"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">
                        Tỉnh/Thành phố{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="province"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.province}
                        onChange={(e) =>
                          updateFormData("province", e.target.value)
                        }
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">
                        Quận/Huyện <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="district"
                        placeholder="Quận/Huyện"
                        value={formData.district}
                        onChange={(e) =>
                          updateFormData("district", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã</Label>
                      <Input
                        id="ward"
                        placeholder="Phường/Xã"
                        value={formData.ward}
                        onChange={(e) => updateFormData("ward", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Địa chỉ cụ thể <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, tên đường..."
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">
                      Ghi chú đơn hàng (không bắt buộc)
                    </Label>
                    <Textarea
                      id="note"
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                      rows={3}
                      value={formData.note}
                      onChange={(e) => updateFormData("note", e.target.value)}
                    />
                  </div>
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
    </div>
  );
}
