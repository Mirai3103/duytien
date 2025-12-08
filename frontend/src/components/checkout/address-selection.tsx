import { Controller } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import {
  CheckCircle2,
  MapPin,
  Plus,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Address } from "@/components/user/address-dialog";
import type { CheckoutFormData } from "@/routes/_storefront/checkout";

interface Province {
  code: string;
  name: string;
  englishName: string;
}

interface Ward {
  code: string;
  name: string;
}

interface AddressSelectionProps {
  control: Control<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  addresses: any[];
  provinces: Province[];
  wards: Ward[];
  selectedAddressId: number | null;
  useSavedAddress: boolean;
  onUseSavedAddressChange: (value: boolean) => void;
  onSelectAddress: (address: Address) => void;
  onEditAddress: (address: Address) => void;
  onAddAddress: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  manualProvince: string;
}

export function AddressSelection({
  control,
  setValue,
  addresses,
  provinces,
  wards,
  selectedAddressId,
  useSavedAddress,
  onUseSavedAddressChange,
  onSelectAddress,
  onEditAddress,
  onAddAddress,
  isCreating,
  isUpdating,
  manualProvince,
}: AddressSelectionProps) {
  return (
    <div className="space-y-4">
      {/* Switch to toggle between saved addresses and manual entry */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <Label htmlFor="use-saved-address" className="text-base font-medium cursor-pointer">
              Sử dụng địa chỉ của tôi
            </Label>
            <p className="text-sm text-muted-foreground">
              {useSavedAddress ? "Chọn từ địa chỉ đã lưu" : "Nhập địa chỉ giao hàng"}
            </p>
          </div>
        </div>
        <Switch
          id="use-saved-address"
          checked={useSavedAddress}
          onCheckedChange={onUseSavedAddressChange}
        />
      </div>

      {/* Saved Addresses Section */}
      {useSavedAddress ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Chọn địa chỉ giao hàng</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddAddress}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ mới
            </Button>
          </div>

          {addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedAddressId === address.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        onSelectAddress({
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
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">
                          {address.fullName}
                        </p>
                        {address.isDefault && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {address.phone}
                      </p>
                      <p className="text-sm">
                        {address.detail}, {address.ward},{" "}
                        {address.province}
                      </p>
                      {address.note && (
                        <p className="text-sm text-muted-foreground italic mt-1">
                          Ghi chú: {address.note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {selectedAddressId === address.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onEditAddress({
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
                        disabled={isCreating || isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Bạn chưa có địa chỉ nào
              </p>
              <Button onClick={onAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ đầu tiên
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Manual Address Entry Form
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Nhập địa chỉ giao hàng</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manualFullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="manualFullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="manualFullName"
                    placeholder="Nhập họ và tên"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualPhone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="manualPhone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="manualPhone"
                    placeholder="Nhập số điện thoại"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualProvince">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="manualProvince"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("manualWard", ""); // Reset ward when province changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualWard">
              Quận/Huyện/Xã <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="manualWard"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!manualProvince}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Quận/Huyện/Xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualDetail">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="manualDetail"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="manualDetail"
                  placeholder="Số nhà, tên đường..."
                  rows={2}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualNote">
              Ghi chú địa chỉ (không bắt buộc)
            </Label>
            <Controller
              name="manualNote"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="manualNote"
                  placeholder="Ghi chú về địa chỉ..."
                  rows={2}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

