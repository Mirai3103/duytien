import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/auth">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Điều khoản dịch vụ</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cập nhật lần cuối: Tháng 10, 2025
              </p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h2>1. Giới thiệu</h2>
              <p>
                Chào mừng bạn đến với website của chúng tôi. Khi truy cập và sử dụng website này,
                bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây.
              </p>

              <h2>2. Quyền sở hữu trí tuệ</h2>
              <p>
                Toàn bộ nội dung trên website này, bao gồm văn bản, đồ họa, logo, biểu tượng,
                hình ảnh, clip âm thanh, tải xuống kỹ thuật số và phần mềm đều là tài sản của
                chúng tôi hoặc các nhà cung cấp nội dung của chúng tôi.
              </p>

              <h2>3. Tài khoản người dùng</h2>
              <p>
                Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác và đầy đủ. Bạn chịu
                trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu của mình.
              </p>

              <h2>4. Đặt hàng và thanh toán</h2>
              <p>
                Tất cả các đơn đặt hàng phải tuân theo sự chấp nhận và tính khả dụng của chúng
                tôi. Chúng tôi có quyền từ chối bất kỳ đơn đặt hàng nào vì bất kỳ lý do gì.
              </p>

              <h2>5. Giá cả và khuyến mãi</h2>
              <p>
                Giá của các sản phẩm có thể thay đổi mà không cần thông báo trước. Các chương
                trình khuyến mãi có thể bị giới hạn về số lượng và thời gian.
              </p>

              <h2>6. Vận chuyển và giao hàng</h2>
              <p>
                Chúng tôi sẽ cố gắng giao hàng trong thời gian ước tính, tuy nhiên thời gian
                giao hàng có thể thay đổi tùy thuộc vào vị trí và tình trạng hàng tồn kho.
              </p>

              <h2>7. Chính sách hoàn trả</h2>
              <p>
                Sản phẩm có thể được hoàn trả trong vòng 7 ngày kể từ ngày nhận hàng, với điều
                kiện sản phẩm chưa qua sử dụng và còn nguyên vẹn.
              </p>

              <h2>8. Giới hạn trách nhiệm</h2>
              <p>
                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu
                nhiên hoặc hậu quả nào phát sinh từ việc sử dụng website này.
              </p>

              <h2>9. Thay đổi điều khoản</h2>
              <p>
                Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Việc bạn tiếp tục
                sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều
                khoản mới.
              </p>

              <h2>10. Liên hệ</h2>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với
                chúng tôi qua email: support@example.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
