import {
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ShoppingBag,
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
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
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
      orderBy: sorting[0]?.id as "createdAt" | "name" | undefined,
      orderDirection: sorting[0]?.desc ? "desc" : "asc",
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

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 hover:bg-transparent"
            >
              Khách hàng
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={row.original.image} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {row.original.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {row.original.name || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                ID: {row.original.id.slice(0, 8)}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Liên hệ",
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-foreground">{row.original.email}</p>
            {row.original.phone && (
              <p className="text-sm text-muted-foreground">
                {row.original.phone}
              </p>
            )}
          </div>
        ),
      },
    
      {
        accessorKey: "emailVerified",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge variant={row.original.emailVerified ? "default" : "outline"}>
            {row.original.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 hover:bg-transparent"
            >
              Ngày tham gia
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem className="text-foreground hover:bg-secondary">
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  });

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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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
