import { useQueries } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useTRPC } from "@/lib/trpc";
import { ActiveFilters } from "./ActiveFilters";
import { FilterContent } from "./FilterContent";
import { FilterSidebar } from "./FilterSidebar";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { SearchBar } from "./SearchBar";
import { useFilters } from "./hooks/useFilters";
import { useSortOptions } from "./hooks/useSortOptions";
import { Await } from "@tanstack/react-router";

const SearchProducts = () => {
  const [sortBy, setSortBy] = useState("Mới nhất");
  const { products, total } = useLoaderData({ from: "/_storefront/search" });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchParams = useSearch({ from: "/_storefront/search" });
  const navigate = useNavigate();
  const trpc = useTRPC();

  // Fetch categories and brands
  const [categoriesQuery, brandsQuery] = useQueries({
    queries: [
      trpc.categories.getAllParentCategories.queryOptions(),
      trpc.brands.getAll.queryOptions({ page: 1, limit: 200, search: "" }),
    ],
  });

  // Custom hooks
  const {
    pendingFilters,
    appliedFilters,
    setPendingFilters,
    togglePendingCategory,
    togglePendingBrand,
    applyFilters,
    clearFilters,
    removeAppliedFilter,
    hasActiveFilters,
    activeFilterCount,
  } = useFilters({ categoriesData: categoriesQuery.data });

  const { currentSort } = useSortOptions(sortBy);

  // Pagination
  // const totalPages = Math.ceil(total / searchParams.limit);
  const currentPage = searchParams.page;

  const handlePageChange = (page: number) => {
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        page,
      },
    });
  };

  const handleClearFilters = () => {
    clearFilters();
    setShowMobileFilters(false);
  };

  // Update sortBy when URL params change
  useEffect(() => {
    setSortBy(currentSort);
  }, [currentSort]);

  const filterContent = (
    <FilterContent
      pendingFilters={pendingFilters}
      setPendingFilters={setPendingFilters}
      togglePendingCategory={togglePendingCategory}
      togglePendingBrand={togglePendingBrand}
      applyFilters={() => {
        applyFilters();
        setShowMobileFilters(false);
      }}
      categoriesData={categoriesQuery.data}
      brandsData={brandsQuery.data}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <SearchBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            showMobileFilters={showMobileFilters}
            onMobileFiltersChange={setShowMobileFilters}
            onClearFilters={handleClearFilters}
            filterContent={filterContent}
          />

          <ActiveFilters
            appliedFilters={appliedFilters}
            categoriesData={categoriesQuery.data}
            brandsData={brandsQuery.data}
            onRemoveFilter={removeAppliedFilter}
            onClearFilters={clearFilters}
          />

          <div className="flex gap-6">
            <FilterSidebar
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              onClearFilters={clearFilters}
            >
              {filterContent}
            </FilterSidebar>

            <Await
              promise={Promise.all([products, total])}
              fallback={<ProductGridSkeleton />}
            >
              {(data) => {
                return (
                  <ProductGrid
                    products={data[0] as any}
                    total={data[1] as number}
                    currentPage={currentPage}
                    totalPages={Math.ceil(data[1] / searchParams.limit)}
                    onPageChange={handlePageChange}
                    onClearFilters={clearFilters}
                  />
                );
              }}
            </Await>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchProducts;
