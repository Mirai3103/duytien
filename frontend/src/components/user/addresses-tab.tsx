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
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
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

// Mock data
const initialAddresses: Address[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    address: "456 Đường XYZ",
    ward: "Phường 2",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    isDefault: false,
  },
];

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSaveAddress = (
    addressData: Omit<Address, "id"> & { id?: number }
  ) => {
    if (addressData.id) {
      // Update existing
      setAddresses(
        addresses.map((addr) =>
          addr.id === addressData.id
            ? { ...addressData, id: addressData.id }
            : addr
        )
      );
      toast.success("Cập nhật địa chỉ thành công!");
    } else {
      // Add new
      const newId = Math.max(...addresses.map((a) => a.id)) + 1;
      setAddresses([...addresses, { ...addressData, id: newId }]);
      toast.success("Thêm địa chỉ thành công!");
    }

    // If new address is set as default, remove default from others
    if (addressData.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === addressData.id
            ? { ...addressData, id: addressData.id || addr.id }
            : { ...addr, isDefault: false }
        )
      );
    }
  };

  const handleDeleteAddress = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setAddresses(addresses.filter((addr) => addr.id !== deletingId));
      toast.success("Xóa địa chỉ thành công!");
      setDeletingId(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Đã đặt làm địa chỉ mặc định!");
  };

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
                  <CardTitle className="text-lg">{address.name}</CardTitle>
                </div>
                {address.isDefault && <Badge variant="default">Mặc định</Badge>}
              </div>
              <CardDescription>{address.phone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <p>{address.address}</p>
                <p className="text-muted-foreground">
                  {address.ward}, {address.district}
                </p>
                <p className="text-muted-foreground">{address.city}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
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
                    >
                      Đặt mặc định
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteAddress(address.id)}
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

      {addresses.length === 0 && (
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
