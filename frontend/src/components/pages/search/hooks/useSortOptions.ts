import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SORT_OPTIONS } from "../types";

export function useSortOptions(sortBy: string) {
  const searchParams = useSearch({ from: "/_storefront/search" });
  const navigate = useNavigate();

  useEffect(() => {
    const label = sortBy || "Mới nhất";
    const value = SORT_OPTIONS.find((option) => option.label === label)?.value;

    if (value) {
      navigate({
        to: "/search",
        search: {
          ...searchParams,
          sortField: value.field as any,
          sortDirection: value.direction as any,
        },
      });
    }
  }, [sortBy, navigate, searchParams]);

  return {
    currentSort:
      SORT_OPTIONS.find(
        (option) =>
          option.value.field === searchParams.sortField &&
          option.value.direction === searchParams.sortDirection
      )?.label ?? "Mới nhất",
  };
}
