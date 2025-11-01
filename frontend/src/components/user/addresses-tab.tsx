import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AddressDialog, type Address } from "./address-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function AddressesTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Query to get all addresses
  const { data: addresses = [], isLoading } = useQuery(
    trpc.addresses.getAddresses.queryOptions()
  );

  // Mutation to create address
  const createAddressMutation = useMutation({
    ...trpc.addresses.createAddress.mutationOptions(),
    onSuccess: () => {
      toast.success("Thêm địa chỉ thành công!");
      queryClient.invalidateQueries({
        queryKey: trpc.addresses.getAddresses.queryOptions().queryKey,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi thêm địa chỉ");
    },
  });

  // Mutation to update address
  const updateAddressMutation = useMutation({
    ...trpc.addresses.updateAddress.mutationOptions(),
    onSuccess: () => {
      toast.success("Cập nhật địa chỉ thành công!");
      queryClient.invalidateQueries({
        queryKey: trpc.addresses.getAddresses.queryOptions().queryKey,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật địa chỉ");
    },
  });

  // Mutation to delete address
  const deleteAddressMutation = useMutation({
    ...trpc.addresses.deleteAddress.mutationOptions(),
    onSuccess: () => {
      toast.success("Xóa địa chỉ thành công!");
      queryClient.invalidateQueries({
        queryKey: trpc.addresses.getAddresses.queryOptions().queryKey,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa địa chỉ");
    },
  });

  // Mutation to set default address
  const setDefaultMutation = useMutation({
    ...trpc.addresses.setDefaultAddress.mutationOptions(),
    onSuccess: () => {
      toast.success("Đã đặt làm địa chỉ mặc định!");
      queryClient.invalidateQueries({
        queryKey: trpc.addresses.getAddresses.queryOptions().queryKey,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra");
    },
  });

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSaveAddress = async (
    addressData: Omit<Address, "id"> & { id?: number }
  ) => {
    if (addressData.id) {
      // Update existing
      await updateAddressMutation.mutateAsync({
        id: addressData.id,
        fullName: addressData.fullName,
        phone: addressData.phone,
        detail: addressData.detail,
        ward: addressData.ward,
        province: addressData.province,
        note: addressData.note || "",
        isDefault: addressData.isDefault,
      });
    } else {
      // Add new
      await createAddressMutation.mutateAsync({
        fullName: addressData.fullName,
        phone: addressData.phone,
        detail: addressData.detail,
        ward: addressData.ward,
        province: addressData.province,
        note: addressData.note || "",
        isDefault: addressData.isDefault,
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteAddressMutation.mutateAsync({ id: deletingId });
      setDeletingId(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultMutation.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Địa chỉ giao hàng</h2>
          <p className="text-muted-foreground">
            Quản lý địa chỉ giao hàng của bạn
          </p>
        </div>
        <Button onClick={handleAddAddress}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{address.fullName}</CardTitle>
                </div>
                {address.isDefault && <Badge variant="default">Mặc định</Badge>}
              </div>
              <CardDescription>{address.phone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <p>{address.detail}</p>
                <p className="text-muted-foreground">
                  {address.ward}, {address.province}
                </p>
                {address.note && (
                  <p className="text-muted-foreground italic mt-2">
                    Ghi chú: {address.note}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleEditAddress({
                      id: address.id,
                      fullName: address.fullName,
                      phone: address.phone,
                      detail: address.detail,
                      ward: address.ward,
                      province: address.province,
                      note: address.note || "",
                      isDefault: address.isDefault,
                    })
                  }
                  disabled={
                    updateAddressMutation.isPending ||
                    deleteAddressMutation.isPending ||
                    setDefaultMutation.isPending
                  }
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Sửa
                </Button>
                {!address.isDefault && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={
                        updateAddressMutation.isPending ||
                        deleteAddressMutation.isPending ||
                        setDefaultMutation.isPending
                      }
                    >
                      Đặt mặc định
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={
                        updateAddressMutation.isPending ||
                        deleteAddressMutation.isPending ||
                        setDefaultMutation.isPending
                      }
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Xóa
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Chưa có địa chỉ nào</h3>
            <p className="text-muted-foreground mb-4">
              Thêm địa chỉ giao hàng để thuận tiện cho việc đặt hàng
            </p>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
