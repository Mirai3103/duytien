import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Cake,
} from "lucide-react";

interface CustomerDetailModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailModal({
  userId,
  open,
  onOpenChange,
}: CustomerDetailModalProps) {
  const trpc = useTRPC();
  const { data: user, isLoading } = useQuery({
    ...trpc.users.getUserById.queryOptions(userId || ""),
    enabled: !!userId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Chi tiết khách hàng
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-start gap-4 pb-6 border-b border-border">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {user.name || "N/A"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ID: {user.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={user.emailVerified ? "default" : "outline"}
                      className="gap-1"
                    >
                      {user.emailVerified ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                    </Badge>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status === "active" ? "Hoạt động" : "Khóa"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm text-foreground mt-1">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {user.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Giới tính
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {user.gender === "male"
                      ? "Nam"
                      : user.gender === "female"
                        ? "Nữ"
                        : user.gender === "other"
                          ? "Khác"
                          : "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Cake className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ngày sinh
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ngày tham gia
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Vai trò
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {user.role === "admin"
                      ? "Quản trị viên"
                      : user.role === "customer"
                        ? "Khách hàng"
                        : user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                <div className="p-2 rounded-full bg-primary/20">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng đơn hàng
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {user.totalOrders || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
                <div className="p-2 rounded-full bg-green-500/20">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng chi tiêu
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(user.totalAmount) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Không tìm thấy thông tin khách hàng
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

