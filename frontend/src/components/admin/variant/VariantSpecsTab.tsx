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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

interface VariantSpecsTabProps {
  variantId: number;
}

// Type definitions
interface SpecGroup {
  id: number;
  name: string;
}

interface SpecKey {
  id: number;
  name: string;
  groupId: number;
}

interface SpecValue {
  id: number;
  value: string;
  keyId: number;
}

interface VariantSpec {
  isFeatured: boolean;
  value?: {
    id: number;
    value: string;
    key?: {
      id: number;
      name: string;
      group?: {
        id: number;
        name: string;
      };
    };
  };
}

// Zod Schemas
const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Tên nhóm là bắt buộc")
    .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
    .max(100, "Tên nhóm không được quá 100 ký tự")
    .trim(),
});

const addSpecSchema = z.object({
  groupId: z.number({
    required_error: "Vui lòng chọn nhóm thông số",
  }),
  keyName: z
    .string()
    .min(1, "Tên thông số là bắt buộc")
    .min(2, "Tên thông số phải có ít nhất 2 ký tự")
    .max(100, "Tên thông số không được quá 100 ký tự")
    .trim(),
  value: z
    .string()
    .min(1, "Giá trị là bắt buộc")
    .max(500, "Giá trị không được quá 500 ký tự")
    .trim(),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;
type AddSpecFormValues = z.infer<typeof addSpecSchema>;

export function VariantSpecsTab({ variantId }: VariantSpecsTabProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // State for selected key ID (for autocomplete suggestions)
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [watchedGroupId, setWatchedGroupId] = useState<number | null>(null);

  // Forms
  const createGroupForm = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const addSpecForm = useForm<AddSpecFormValues>({
    resolver: zodResolver(addSpecSchema),
    defaultValues: {
      groupId: undefined,
      keyName: "",
      value: "",
    },
  });

  // Watch groupId for dependent queries
  useEffect(() => {
    const subscription = addSpecForm.watch((value) => {
      if (value.groupId !== watchedGroupId) {
        setWatchedGroupId(value.groupId ?? null);
        setSelectedKeyId(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [addSpecForm, watchedGroupId]);

  // Queries
  const { data: specGroups = [] } = useQuery(
    trpc.specs.getSpecGroups.queryOptions()
  );

  const { data: specKeys = [] } = useQuery({
    ...trpc.specs.getSpecKeysOfGroup.queryOptions(watchedGroupId!),
    enabled: !!watchedGroupId,
  });

  const { data: validValues = [] } = useQuery({
    ...trpc.specs.getValidValueOfSpecKey.queryOptions(selectedKeyId!),
    enabled: !!selectedKeyId,
  });

  const { data: variantSpecs = [] } = useQuery(
    trpc.specs.getProductVariantSpecs.queryOptions(variantId)
  );

  const invalidateVariantSpecs = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.specs.getProductVariantSpecs.queryKey(variantId),
    });
  };

  // Mutations
  const createGroupMutation = useMutation(
    trpc.specs.createSpecGroup.mutationOptions({
      onSuccess: async () => {
        toast.success("Tạo nhóm thông số thành công");
        createGroupForm.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.specs.getSpecGroups.queryKey(),
        });
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi tạo nhóm");
        console.error(error);
      },
    })
  );

  const createSpecMutation = useMutation(
    trpc.specs.createProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Thêm thông số thành công");
        addSpecForm.reset({
          groupId: addSpecForm.getValues("groupId"), // Keep group selected
          keyName: "",
          value: "",
        });
        setSelectedKeyId(null);
        await invalidateVariantSpecs();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi thêm thông số");
        console.error(error);
      },
    })
  );

  const removeSpecMutation = useMutation(
    trpc.specs.removeProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Xóa thông số thành công");
        await invalidateVariantSpecs();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi xóa thông số");
        console.error(error);
      },
    })
  );

  const toggleFeaturedMutation = useMutation(
    trpc.specs.toggleFeaturedProductVariantSpec.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật thông số đặc biệt thành công");
        await invalidateVariantSpecs();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi cập nhật");
        console.error(error);
      },
    })
  );

  // Handlers
  const onCreateGroup = (data: CreateGroupFormValues) => {
    createGroupMutation.mutate({ name: data.name });
  };

  const onAddSpec = (data: AddSpecFormValues) => {
    createSpecMutation.mutate({
      variantId,
      groupId: data.groupId,
      key: data.keyName,
      value: data.value,
    });
  };

  // Group specs by group for display
  const groupedSpecs = (variantSpecs as VariantSpec[]).reduce(
    (acc: Record<string, VariantSpec[]>, spec) => {
      const groupName = spec.value?.key?.group?.name || "Khác";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(spec);
      return acc;
    },
    {}
  );

  const selectedGroupData = (specGroups as SpecGroup[]).find(
    (g) => g.id === watchedGroupId
  );

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
          <Form {...createGroupForm}>
            <form
              onSubmit={createGroupForm.handleSubmit(onCreateGroup)}
              className="flex gap-3"
            >
              <FormField
                control={createGroupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="VD: Màn hình, Camera, Pin, Bộ nhớ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createGroupMutation.isPending}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {createGroupMutation.isPending ? "Đang tạo..." : "Tạo nhóm"}
              </Button>
            </form>
          </Form>
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
          <Form {...addSpecForm}>
            <form
              onSubmit={addSpecForm.handleSubmit(onAddSpec)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={addSpecForm.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nhóm thông số <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          addSpecForm.setValue("keyName", "");
                          addSpecForm.setValue("value", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhóm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(specGroups as SpecGroup[]).map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addSpecForm.control}
                  name="keyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên thông số <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          list="spec-keys-list"
                          placeholder="VD: Kích thước, Độ phân giải..."
                          disabled={!watchedGroupId}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            
                            // Try to find matching key for autocomplete suggestions
                            const existingKey = (specKeys as SpecKey[]).find(
                              (k) => k.name.toLowerCase() === value.toLowerCase()
                            );
                            setSelectedKeyId(existingKey?.id || null);
                          }}
                        />
                      </FormControl>
                      <datalist id="spec-keys-list">
                        {(specKeys as SpecKey[]).map((k) => (
                          <option key={k.id} value={k.name} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addSpecForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Giá trị <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          list="spec-values-list"
                          placeholder="VD: 6.7 inch, 50MP..."
                          disabled={!watchedGroupId}
                        />
                      </FormControl>
                      <datalist id="spec-values-list">
                        {(validValues as SpecValue[]).map((v) => (
                          <option key={v.id} value={v.value} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={
                      createSpecMutation.isPending ||
                      !addSpecForm.formState.isValid
                    }
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {createSpecMutation.isPending ? "Đang thêm..." : "Thêm"}
                  </Button>
                </div>
              </div>

              {watchedGroupId && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <strong>Nhóm:</strong> {selectedGroupData?.name}
                  {addSpecForm.watch("keyName") && (
                    <>
                      {" | "}
                      <strong>Thông số:</strong> {addSpecForm.watch("keyName")}
                      {selectedKeyId && " (từ danh sách có sẵn)"}
                    </>
                  )}
                </div>
              )}
            </form>
          </Form>
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
              {Object.entries(groupedSpecs).map(([groupName, specs]) => (
                <div key={groupName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-semibold">
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
                          <TableHead className="w-[120px]">Đặc biệt</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Thao tác
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {specs.map((spec, idx) => (
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
                              <Switch
                                checked={spec.isFeatured || false}
                                onCheckedChange={() =>
                                  toggleFeaturedMutation.mutate({
                                    variantId,
                                    specValueId: spec.value!.id,
                                  })
                                }
                                disabled={toggleFeaturedMutation.isPending}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeSpecMutation.mutate({
                                    variantId,
                                    specValueId: spec.value!.id,
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
              ))}
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