import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Vui lòng nhập email')
      return
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ')
      return
    }

    // Demo - In production, call API to send reset email
    console.log('Reset password for:', email)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
              <CardDescription>
                {isSubmitted
                  ? 'Kiểm tra email của bạn'
                  : 'Nhập email để nhận link đặt lại mật khẩu'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Chúng tôi đã gửi link đặt lại mật khẩu đến email:
                    </p>
                    <p className="font-semibold">{email}</p>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng kiểm tra hộp thư đến (hoặc spam) và làm theo hướng dẫn.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Link to="/auth">
                      <Button className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại đăng nhập
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Gửi lại email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError('')
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    Gửi link đặt lại mật khẩu
                  </Button>

                  <Link to="/auth">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại đăng nhập
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
