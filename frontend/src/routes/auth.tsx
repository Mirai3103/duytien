import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

function RouteComponent() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<{
    login?: string
    register?: string
  }>({})

  const updateLoginForm = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, login: undefined }))
  }

  const updateRegisterForm = (field: keyof RegisterForm, value: string | boolean) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, register: undefined }))
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!loginForm.email || !loginForm.password) {
      setErrors({ login: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    if (!validateEmail(loginForm.email)) {
      setErrors({ login: 'Email không hợp lệ' })
      return
    }

    // Demo login
    console.log('Login:', loginForm)
    alert('Đăng nhập thành công! (Demo)')
    navigate({ to: '/' })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !registerForm.fullName ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setErrors({ register: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    if (!validateEmail(registerForm.email)) {
      setErrors({ register: 'Email không hợp lệ' })
      return
    }

    if (registerForm.password.length < 6) {
      setErrors({ register: 'Mật khẩu phải có ít nhất 6 ký tự' })
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrors({ register: 'Mật khẩu xác nhận không khớp' })
      return
    }

    if (!registerForm.agreeTerms) {
      setErrors({ register: 'Vui lòng đồng ý với điều khoản dịch vụ' })
      return
    }

    // Demo register
    console.log('Register:', registerForm)
    alert('Đăng ký thành công! (Demo)')
    setActiveTab('login')
  }

  const handleGoogleLogin = () => {
    // Demo Google login
    console.log('Google login initiated')
    alert('Đăng nhập bằng Google (Demo)\nTrong production, sẽ redirect đến Google OAuth')
    // In production: window.location.href = 'YOUR_GOOGLE_OAUTH_URL'
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Chào mừng bạn</CardTitle>
              <CardDescription>
                Đăng nhập hoặc tạo tài khoản để tiếp tục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Google Login Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                    >
                      <Chrome className="h-4 w-4 mr-2" />
                      Đăng nhập với Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Hoặc đăng nhập với email
                        </span>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10"
                          value={loginForm.email}
                          onChange={(e) => updateLoginForm('email', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Mật khẩu</Label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={loginForm.password}
                          onChange={(e) => updateLoginForm('password', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginForm.rememberMe}
                        onCheckedChange={(checked) =>
                          updateLoginForm('rememberMe', checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm cursor-pointer select-none"
                      >
                        Ghi nhớ đăng nhập
                      </Label>
                    </div>

                    {/* Error Message */}
                    {errors.login && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {errors.login}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg">
                      Đăng nhập
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Google Register Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                    >
                      <Chrome className="h-4 w-4 mr-2" />
                      Đăng ký với Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Hoặc đăng ký với email
                        </span>
                      </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Họ và tên</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          className="pl-10"
                          value={registerForm.fullName}
                          onChange={(e) => updateRegisterForm('fullName', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="example@email.com"
                          className="pl-10"
                          value={registerForm.email}
                          onChange={(e) => updateRegisterForm('email', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={registerForm.password}
                          onChange={(e) => updateRegisterForm('password', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tối thiểu 6 ký tự
                      </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={registerForm.confirmPassword}
                          onChange={(e) => updateRegisterForm('confirmPassword', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={registerForm.agreeTerms}
                        onCheckedChange={(checked) =>
                          updateRegisterForm('agreeTerms', checked as boolean)
                        }
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer select-none">
                        Tôi đồng ý với{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Điều khoản dịch vụ
                        </Link>{' '}
                        và{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Chính sách bảo mật
                        </Link>
                      </Label>
                    </div>

                    {/* Error Message */}
                    {errors.register && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {errors.register}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg">
                      Đăng ký
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Additional Links */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  Bằng cách tiếp tục, bạn đồng ý với{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>{' '}
                  của chúng tôi
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
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
