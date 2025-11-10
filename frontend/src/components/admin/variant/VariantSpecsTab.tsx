import { useState, useId } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, FileText, List, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VariantSpecsTabProps {
  variantId: number;
}

export function VariantSpecsTab({ variantId }: VariantSpecsTabProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const specKeysListId = useId();
  const specValuesListId = useId();

  // States
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [specValue, setSpecValue] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // Queries
  const { data: specGroups = [] } = useQuery(
    trpc.specs.getSpecGroups.queryOptions()
  );

  const { data: specKeys = [] } = useQuery({
    ...trpc.specs.getSpecKeysOfGroup.queryOptions(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  const { data: validValues = [] } = useQuery({
    ...trpc.specs.getValidValueOfSpecKey.queryOptions(selectedKeyId!),
    enabled: !!selectedKeyId,
  });

  const { data: variantSpecs = [] } = useQuery(
    trpc.specs.getProductVariantSpecs.queryOptions(variantId)
  );

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.specs.getProductVariantSpecs.queryKey(variantId),
    });
  };

  // Mutations
  const createGroupMutation = useMutation(
    trpc.specs.createSpecGroup.mutationOptions({
      onSuccess: async () => {
        toast.success("Tạo nhóm thông số thành công");
        setNewGroupName("");
        await queryClient.invalidateQueries({
          queryKey: trpc.specs.getSpecGroups.queryKey(),
        });
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi tạo nhóm");
      },
    })
  );

  const createSpecMutation = useMutation(
    trpc.specs.createProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Thêm thông số thành công");
        setSpecValue("");
        await invalidate();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi thêm thông số");
      },
    })
  );

  const removeSpecMutation = useMutation(
    trpc.specs.removeProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Xóa thông số thành công");
        await invalidate();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi xóa thông số");
      },
    })
  );

  const toggleFeaturedMutation = useMutation(
    trpc.specs.toggleFeaturedProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật thông số đặc biệt thành công");
        await invalidate();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật");
      },
    })
  );

  const selectedGroup = (specGroups as any[]).find(
    (g: any) => g.id === selectedGroupId
  );
  const selectedKey = (specKeys as any[]).find(
    (k: any) => k.id === selectedKeyId
  );

  const canAddSpec =
    selectedGroupId && selectedKeyId && specValue.trim().length > 0;

  // Group specs by group for display
  const groupedSpecs = (variantSpecs as any[]).reduce((acc: any, spec: any) => {
    const groupName = spec.value?.key?.group?.name || "Khác";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(spec);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Create Group Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Tạo nhóm thông số mới</CardTitle>
          </div>
          <CardDescription>
            Tạo nhóm thông số kỹ thuật (VD: Màn hình, Camera, Pin...)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="VD: Màn hình, Camera, Pin, Bộ nhớ..."
              className="flex-1"
            />
            <Button
              onClick={() =>
                createGroupMutation.mutate({ name: newGroupName.trim() })
              }
              disabled={!newGroupName.trim() || createGroupMutation.isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Tạo nhóm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Spec Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Thêm thông số kỹ thuật cho biến thể</CardTitle>
          </div>
          <CardDescription>
            Chọn nhóm, tên thông số và nhập giá trị riêng cho biến thể này
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nhóm thông số <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedGroupId ? String(selectedGroupId) : ""}
                  onValueChange={(v) => {
                    setSelectedGroupId(Number(v));
                    setSelectedKeyId(null);
                    setSpecValue("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    {(specGroups as any[]).map((g: any) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tên thông số <span className="text-red-500">*</span>
                </label>
                <Input
                  list={specKeysListId}
                  value={
                    selectedKeyId
                      ? (specKeys as any[]).find(
                          (k: any) => k.id === selectedKeyId
                        )?.name || ""
                      : ""
                  }
                  onChange={(e) => {
                    const existingKey = (specKeys as any[]).find(
                      (k: any) => k.name === e.target.value
                    );
                    if (existingKey) {
                      setSelectedKeyId(existingKey.id);
                    } else {
                      setSelectedKeyId(null);
                    }
                  }}
                  placeholder="VD: Kích thước, Độ phân giải..."
                  disabled={!selectedGroupId}
                />
                <datalist id={specKeysListId}>
                  {(specKeys as any[]).map((k: any) => (
                    <option key={k.id} value={k.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Giá trị <span className="text-red-500">*</span>
                </label>
                <Input
                  list={specValuesListId}
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="VD: 6.7 inch, 50MP..."
                  disabled={!selectedKeyId}
                />
                <datalist id={specValuesListId}>
                  {(validValues as any[]).map((v: any) => (
                    <option key={v.id} value={v.value} />
                  ))}
                </datalist>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    if (!selectedGroupId || !selectedKeyId) return;
                    const keyName = selectedKey?.name || "";
                    createSpecMutation.mutate({
                      variantId,
                      groupId: selectedGroupId,
                      key: keyName,
                      value: specValue.trim(),
                    });
                  }}
                  disabled={!canAddSpec || createSpecMutation.isPending}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm
                </Button>
              </div>
            </div>

            {selectedGroupId && (
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <strong>Nhóm:</strong> {selectedGroup?.name}
                {selectedKeyId && (
                  <>
                    {" | "}
                    <strong>Thông số:</strong> {selectedKey?.name}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Specs Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Thông số kỹ thuật của biến thể</CardTitle>
          <CardDescription>
            Danh sách tất cả thông số kỹ thuật riêng cho biến thể này
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {Object.keys(groupedSpecs).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedSpecs).map(
                ([groupName, specs]: [string, any]) => (
                  <div key={groupName} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-sm font-semibold"
                      >
                        {groupName}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>Tên thông số</TableHead>
                            <TableHead>Giá trị</TableHead>
                            <TableHead className="w-[120px]">
                              Đặc biệt
                            </TableHead>
                            <TableHead className="w-[100px] text-right">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {specs.map((spec: any, idx: number) => (
                            <TableRow key={spec.value?.id || idx}>
                              <TableCell className="font-medium">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {spec.value?.key?.name}
                                  </span>
                                  {spec.isFeatured && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Thông số đặc biệt</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{spec.value?.value}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={spec.isFeatured || false}
                                    onCheckedChange={() =>
                                      toggleFeaturedMutation.mutate({
                                        variantId,
                                        specValueId: spec.value?.id,
                                      })
                                    }
                                    disabled={toggleFeaturedMutation.isPending}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeSpecMutation.mutate({
                                      variantId,
                                      specValueId: spec.value?.id,
                                    })
                                  }
                                  disabled={removeSpecMutation.isPending}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                Chưa có thông số kỹ thuật
              </p>
              <p className="text-sm">
                Hãy thêm thông số kỹ thuật riêng cho biến thể này
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
