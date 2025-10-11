import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_storefront/cart')({
  component: RouteComponent,
})

// Mock Cart Data
interface CartItem {
  id: number
  productId: number
  name: string
  image: string
  price: number
  oldPrice?: number
  quantity: number
  color?: string
  storage?: string
  inStock: boolean
  maxQuantity: number
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    name: 'iPhone 15 Pro Max',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png',
    price: 29990000,
    oldPrice: 34990000,
    quantity: 1,
    color: 'Titan Tự Nhiên',
    storage: '256GB',
    inStock: true,
    maxQuantity: 5,
  },
  {
    id: 2,
    productId: 4,
    name: 'MacBook Air M3 13 inch',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-2024.png',
    price: 27990000,
    oldPrice: 29990000,
    quantity: 1,
    storage: '8GB/256GB',
    inStock: true,
    maxQuantity: 3,
  },
  {
    id: 3,
    productId: 5,
    name: 'AirPods Pro 2 USB-C',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usbc.png',
    price: 5990000,
    oldPrice: 6990000,
    quantity: 2,
    inStock: true,
    maxQuantity: 10,
  },
]

function RouteComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const quantity = Math.max(1, Math.min(newQuantity, item.maxQuantity))
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponCode('')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const shipping = subtotal >= 10000000 ? 0 : 30000 // Free shipping over 10M
  const total = subtotal - discount + shipping

  const isEmpty = cartItems.length === 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Giỏ hàng của bạn</h1>
            <p className="text-muted-foreground">
              {isEmpty ? 'Giỏ hàng trống' : `${cartItems.length} sản phẩm`}
            </p>
          </div>

          {isEmpty ? (
            // Empty Cart State
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-24 w-24 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa có sản phẩm nào trong giỏ hàng
                </p>
                <Link to="/">
                  <Button size="lg">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <Link
                            to="/product/$id"
                            params={{ id: String(item.productId) }}
                            className="flex-shrink-0"
                          >
                            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to="/product/$id"
                              params={{ id: String(item.productId) }}
                              className="hover:text-primary"
                            >
                              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>

                            {/* Variants */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.color && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.color}
                                </Badge>
                              )}
                              {item.storage && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.storage}
                                </Badge>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-lg font-bold text-primary">
                                {item.price.toLocaleString('vi-VN')}đ
                              </span>
                              {item.oldPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {item.oldPrice.toLocaleString('vi-VN')}đ
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls & Remove Button */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </Button>
                            </div>

                            {/* Stock Status */}
                            {!item.inStock && (
                              <p className="text-sm text-destructive mt-2">Hết hàng</p>
                            )}
                          </div>

                          {/* Item Total (Desktop) */}
                          <div className="hidden md:block text-right">
                            <p className="font-bold text-lg">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </p>
                            {item.oldPrice && (
                              <p className="text-sm text-muted-foreground">
                                Tiết kiệm{' '}
                                {((item.oldPrice - item.price) * item.quantity).toLocaleString('vi-VN')}đ
                              </p>
                            )}
                          </div>
                        </div>

                        {index < cartItems.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Coupon Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Mã giảm giá
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {appliedCoupon}
                          </span>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            -10%
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-700"
                        >
                          Xóa
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                        />
                        <Button onClick={applyCoupon} variant="outline">
                          Áp dụng
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Thử mã "SAVE10" để được giảm 10%
                    </p>
                  </CardContent>
                </Card>

                {/* Continue Shopping Link */}
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Tổng đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary Items */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium">
                          {subtotal.toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá</span>
                          <span className="font-medium">
                            -{discount.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600">Miễn phí</span>
                          ) : (
                            `${shipping.toLocaleString('vi-VN')}đ`
                          )}
                        </span>
                      </div>

                      {subtotal < 10000000 && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          Mua thêm{' '}
                          <span className="font-semibold text-foreground">
                            {(10000000 - subtotal).toLocaleString('vi-VN')}đ
                          </span>{' '}
                          để được miễn phí vận chuyển
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">
                          {total.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link to="/checkout">
                      <Button size="lg" className="w-full">
                        Tiến hành thanh toán
                      </Button>
                    </Link>

                    {/* Additional Info */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-start gap-2 text-sm">
                        <div className="text-green-600 mt-0.5">✓</div>
                        <span className="text-muted-foreground">
                          Miễn phí đổi trả trong 7 ngày
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <div className="text-green-600 mt-0.5">✓</div>
                        <span className="text-muted-foreground">
                          Bảo hành chính hãng toàn quốc
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <div className="text-green-600 mt-0.5">✓</div>
                        <span className="text-muted-foreground">
                          Giao hàng nhanh 2-3 ngày
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
