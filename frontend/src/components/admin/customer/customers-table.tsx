import {
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

interface CustomersTableProps {
  search?: string;
  emailVerified?: boolean;
  dateRange?: {
    from?: Date;
    to?: Date;
  } | null;
}

export function CustomersTable({
  search,
  emailVerified,
  dateRange,
}: CustomersTableProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const limit = 20;

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, emailVerified, dateRange]);

  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.users.searchUsers.queryOptions({
      page,
      limit,
      search,
      emailVerified,
      dateRange,
      orderBy: sortBy,
      orderDirection: sortDirection,
    })
  ) as {
    data:
      | {
          users: any[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }
      | undefined;
    isLoading: boolean;
  };

  const handleSort = (column: "createdAt" | "name") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Khách hàng
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Ngày tham gia
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users && data.users.length > 0 ? (
                data.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {user.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-foreground">{user.email}</p>
                        {user.phone && (
                          <p className="text-sm text-muted-foreground">
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.emailVerified ? "default" : "outline"}
                      >
                        {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-border"
                        >
                          <DropdownMenuItem className="text-foreground hover:bg-secondary">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Không tìm thấy khách hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Hiển thị {data?.users.length ?? 0} trong tổng số {data?.total ?? 0}{" "}
            khách hàng
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="text-sm text-muted-foreground">
              Trang {page} / {data?.totalPages ?? 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.totalPages ?? 1)}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
