import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, XCircle, Home, ShoppingCart, ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/order/$id/$status')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { id, status } = params;
    const trpc = context.trpcClient;
    const result = await trpc.orders.getOrder.query({
      id: Number(id),
    });
    return {
      order: result,
      status: status,
    };
  },
})

function RouteComponent() {
  const { order, status } = Route.useLoaderData()
  const navigate = useNavigate()

  const isSuccess = status === 'success'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className={`text-center py-12 ${
              isSuccess 
                ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30' 
                : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30'
            }`}>
              {isSuccess ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-500 p-4">
                      <CheckCircle2 className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      Đặt hàng thành công!
                    </h1>
                    <p className="text-muted-foreground">
                      Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-red-500 p-4">
                      <XCircle className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
                      Thanh toán thất bại
                    </h1>
                    <p className="text-muted-foreground">
                      Đơn hàng của bạn chưa được thanh toán thành công.
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="py-8 space-y-6">
              {/* Order Information */}
              {order && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Mã đơn hàng</span>
                    <span className="font-semibold">#{order.code}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Tổng tiền</span>
                    <span className="font-bold text-xl text-primary">
                      {Number(order.lastPayment?.amount).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <span className={`font-semibold ${
                      isSuccess ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isSuccess ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Phương thức thanh toán</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium uppercase">
                        {order.paymentMethod}
                      </span>
                      {order.payType === 'partial' && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                          Trả góp
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Installment Information */}
              {order && order.payType === 'partial' && (
                <>
                  <Separator />
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Thông tin trả góp
                      </h3>
                    </div>
                    
                    {isSuccess && (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                          ✓ Đã thanh toán kỳ {(order.installmentCount || 0) - (order.remainingInstallments || 0)} / {order.installmentCount}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Tổng số kỳ:</span>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {order.installmentCount} tháng
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Số tiền mỗi kỳ:</span>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {Number(order.nextPayAmount || 0).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Đã thanh toán:</span>
                        <p className="font-semibold text-green-600">
                          {Number(order.totalPaidAmount || 0).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Còn lại:</span>
                        <p className="font-semibold text-orange-600">
                          {order.remainingInstallments || 0} kỳ
                        </p>
                      </div>
                    </div>

                    {(order.remainingInstallments || 0) > 0 && (
                      <>
                        <Separator className="bg-blue-200 dark:bg-blue-800" />
                        <div className="bg-white dark:bg-gray-950 p-3 rounded-md">
                          <div className="text-sm">
                            <p className="text-blue-700 dark:text-blue-300 mb-1">
                              Kỳ thanh toán tiếp theo:
                            </p>
                            <p className="font-bold text-blue-900 dark:text-blue-100">
                              {order.nextPayDay && new Date(order.nextPayDay).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                              Bạn có thể thanh toán kỳ tiếp theo trong trang "Đơn hàng của tôi"
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {(order.remainingInstallments || 0) === 0 && (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <p className="font-semibold text-green-700 dark:text-green-300">
                            Đã hoàn thành thanh toán trả góp
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Additional Messages */}
              {isSuccess ? (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                    ✓ Đơn hàng đã được ghi nhận
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    ✓ Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    ✓ Thời gian giao hàng dự kiến: 2-3 ngày
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">
                    Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ với chúng tôi 
                    hoặc thử lại sau. Đơn hàng của bạn vẫn được lưu và bạn có thể thanh toán lại.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Về trang chủ
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={() => navigate({ to: '/' })}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Tiếp tục mua sắm
                  </Button>
                </div>

                {!isSuccess && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate({ to: '/cart' })}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại giỏ hàng
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
