import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/privacy')({
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
              <CardTitle className="text-3xl">Chính sách bảo mật</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cập nhật lần cuối: Tháng 10, 2025
              </p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h2>1. Thu thập thông tin</h2>
              <p>
                Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp cho chúng tôi, bao gồm:
              </p>
              <ul>
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Địa chỉ giao hàng</li>
                <li>Thông tin thanh toán</li>
              </ul>

              <h2>2. Sử dụng thông tin</h2>
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul>
                <li>Xử lý và giao các đơn hàng của bạn</li>
                <li>Cung cấp dịch vụ khách hàng</li>
                <li>Gửi thông tin về sản phẩm và khuyến mãi (nếu bạn đồng ý)</li>
                <li>Cải thiện website và trải nghiệm người dùng</li>
                <li>Phát hiện và ngăn chặn gian lận</li>
              </ul>

              <h2>3. Chia sẻ thông tin</h2>
              <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>
              <ul>
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Để hỗ trợ hoạt động kinh doanh của
                  chúng tôi (vận chuyển, thanh toán, v.v.)
                </li>
                <li>
                  <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi pháp luật hoặc quy định
                </li>
                <li>
                  <strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền, tài sản hoặc an toàn của
                  chúng tôi và người dùng
                </li>
              </ul>

              <h2>4. Bảo mật thông tin</h2>
              <p>
                Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ
                thông tin cá nhân của bạn khỏi truy cập, sửa đổi, tiết lộ hoặc phá hủy trái phép.
              </p>

              <h2>5. Cookies</h2>
              <p>
                Website của chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng. Cookies
                giúp chúng tôi hiểu cách bạn sử dụng website và cá nhân hóa nội dung.
              </p>

              <h2>6. Quyền của bạn</h2>
              <p>Bạn có quyền:</p>
              <ul>
                <li>Truy cập và nhận bản sao thông tin cá nhân của bạn</li>
                <li>Yêu cầu sửa chữa thông tin không chính xác</li>
                <li>Yêu cầu xóa thông tin cá nhân</li>
                <li>Phản đối việc xử lý thông tin cá nhân</li>
                <li>Rút lại sự đồng ý bất kỳ lúc nào</li>
              </ul>

              <h2>7. Lưu trữ dữ liệu</h2>
              <p>
                Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để thực
                hiện các mục đích đã nêu trong chính sách này, trừ khi pháp luật yêu cầu hoặc
                cho phép thời gian lưu trữ lâu hơn.
              </p>

              <h2>8. Chuyển giao dữ liệu quốc tế</h2>
              <p>
                Thông tin của bạn có thể được chuyển đến và lưu trữ tại các máy chủ ở ngoài quốc
                gia của bạn. Chúng tôi sẽ đảm bảo rằng việc chuyển giao này tuân thủ các quy định
                về bảo vệ dữ liệu.
              </p>

              <h2>9. Thay đổi chính sách</h2>
              <p>
                Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Chúng tôi sẽ
                thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên
                trang này.
              </p>

              <h2>10. Liên hệ</h2>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với
                chúng tôi:
              </p>
              <ul>
                <li>Email: privacy@example.com</li>
                <li>Điện thoại: 1900 xxxx</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
