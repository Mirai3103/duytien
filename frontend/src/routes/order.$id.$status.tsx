import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, XCircle, Home, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
                    <span className="font-medium uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
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
