import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import _ from "lodash";

interface ComparisonTableProps {
  data: Array<{
    variant: any;
    product: any;
  }>;
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  if (data.length === 0) return null;

  // Extract and organize all specs from all products
  const allSpecs = data.map(({ variant, product }) => {
    const variantSpecs = variant?.specs || [];
    const productSpecs = product?.specs || [];
    const combinedSpecs = [...variantSpecs, ...productSpecs];

    // Transform specs into grouped structure
    const grouped = _(combinedSpecs)
      .groupBy((item) => item.value.key.group.id)
      .map((items, groupId) => ({
        groupId: Number(groupId),
        groupName: _.get(items, "[0].value.key.group.name", ""),
        specs: items
          .filter((i) => i.value?.value) // Only include specs with values
          .map((i) => ({
            specKey: _.get(i, "value.key.name", ""),
            specValue: _.get(i, "value.value", ""),
            specKeyId: _.get(i, "value.key.id", ""),
          })),
      }))
      .value();

    return grouped;
  });

  // Get all unique spec groups and keys
  const allGroupsMap = new Map<
    number,
    {
      groupId: number;
      groupName: string;
      specKeys: Map<
        number,
        {
          specKey: string;
          specKeyId: number;
        }
      >;
    }
  >();

  allSpecs.forEach((productSpecs) => {
    productSpecs.forEach((group) => {
      if (!allGroupsMap.has(group.groupId)) {
        allGroupsMap.set(group.groupId, {
          groupId: group.groupId,
          groupName: group.groupName,
          specKeys: new Map(),
        });
      }

      const groupData = allGroupsMap.get(group.groupId)!;
      group.specs.forEach((spec) => {
        if (!groupData.specKeys.has(spec.specKeyId)) {
          groupData.specKeys.set(spec.specKeyId, {
            specKey: spec.specKey,
            specKeyId: spec.specKeyId,
          });
        }
      });
    });
  });

  // Convert to array for rendering
  const groupsArray = Array.from(allGroupsMap.values()).map((group) => ({
    ...group,
    specKeys: Array.from(group.specKeys.values()),
  }));
  const getSpecValue = (productIndex: number, specKeyId: number): string => {
    const productSpecs = allSpecs[productIndex];
    for (const group of productSpecs) {
      const spec = group.specs.find((s) => s.specKeyId === specKeyId);
      if (spec) return spec.specValue;
    }
    return "-";
  };
  const hasValueDifference = (specKeyId: number): boolean => {
    const values = data.map((_, index) => getSpecValue(index, specKeyId));
    const uniqueValues = new Set(values.filter((v) => v !== "-"));
    return uniqueValues.size > 1;
  };

  // Filter specs based on showOnlyDifferences
  const filteredGroupsArray = groupsArray
    .map((group) => ({
      ...group,
      specKeys: showOnlyDifferences
        ? group.specKeys.filter((specKey) =>
            hasValueDifference(specKey.specKeyId)
          )
        : group.specKeys,
    }))
    .filter((group) => group.specKeys.length > 0); // Remove empty groups

  // Helper to get spec value for a specific product and spec key

  // Helper to check if values differ for highlighting

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Bảng so sánh thông số</h3>
            <p className="text-sm text-muted-foreground">
              So sánh chi tiết các thông số kỹ thuật
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-differences"
              checked={showOnlyDifferences}
              onCheckedChange={setShowOnlyDifferences}
            />
            <Label htmlFor="show-differences" className="cursor-pointer">
              Chỉ hiện khác biệt
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="text-left p-4 font-semibold border-r min-w-[200px]">
                  Thông số
                </th>
                {data.map(({ variant }, index) => (
                  <th
                    key={variant?.id || index}
                    className="text-center p-4 min-w-[200px] border-r last:border-r-0"
                  >
                    <div className="space-y-2">
                      <img
                        src={variant?.image!}
                        alt={variant?.name}
                        className="w-20 h-20 object-contain mx-auto"
                      />
                      <div className="text-xs font-medium line-clamp-2">
                        {variant?.name}
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {Number(variant?.price).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGroupsArray.map((group) => (
                <>
                  {/* Group Header */}
                  <tr key={`group-${group.groupId}`} className="bg-muted/30">
                    <td
                      colSpan={data.length + 1}
                      className="p-3 font-semibold text-primary"
                    >
                      {group.groupName}
                    </td>
                  </tr>

                  {/* Spec Rows */}
                  {group.specKeys.map((specKey, specIndex) => {
                    const isDifferent = hasValueDifference(specKey.specKeyId);
                    return (
                      <tr
                        key={`spec-${specKey.specKeyId}`}
                        className={`border-b hover:bg-muted/20 ${
                          specIndex % 2 === 0 ? "bg-muted/5" : ""
                        }`}
                      >
                        <td className="p-3 font-medium text-sm border-r">
                          <div className="flex items-center gap-2">
                            {specKey.specKey}
                            {isDifferent && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                              >
                                Khác
                              </Badge>
                            )}
                          </div>
                        </td>
                        {data.map((_, productIndex) => {
                          const value = getSpecValue(
                            productIndex,
                            specKey.specKeyId
                          );
                          return (
                            <td
                              key={`value-${productIndex}`}
                              className={`p-3 text-sm text-center border-r last:border-r-0 ${
                                isDifferent && value !== "-"
                                  ? "bg-yellow-500/5 font-medium"
                                  : ""
                              }`}
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </>
              ))}

              {/* Empty state if no specs */}
              {filteredGroupsArray.length === 0 && (
                <tr>
                  <td
                    colSpan={data.length + 1}
                    className="p-8 text-center text-muted-foreground"
                  >
                    {showOnlyDifferences
                      ? "Không có thông số nào khác biệt giữa các sản phẩm"
                      : "Không có thông số kỹ thuật để hiển thị"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
