"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import rawProducts from "@/data/products.json";
import { Product, ProductVariant } from "@/types/product";
import ProductCard from "@/components/home/featured/ProductCard";
import ProductListCard from "@/components/products/ProductListCard";
import ProductFilterSidebar, {
  CategoryOption,
  TagOption,
} from "@/components/products/ProductFilterSidebar";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  PackageSearch,
  CheckCircle2,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function ProductsClient() {
  const searchParams = useSearchParams();

  const allProducts: Product[] = useMemo(() => {
    return rawProducts as Product[];
  }, []);

  const { minPriceLimit, maxPriceLimit } = useMemo(() => {
    const prices = allProducts.map((p) => p.base_price);
    return {
      minPriceLimit: Math.floor(Math.min(...prices)),
      maxPriceLimit: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts]);

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialTag = searchParams.get("tag");
  const initialFeatured = searchParams.get("featured") === "true";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceLimit,
    maxPriceLimit,
  ]);
  const [minRating, setMinRating] = useState<number>(0);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(initialFeatured);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const tagParam = searchParams.get("tag");
    const featuredParam = searchParams.get("featured");

    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam !== null) setSearchQuery(searchParam);
    if (tagParam) setSelectedTags([tagParam]);
    if (featuredParam === "true") setFeaturedOnly(true);
  }, [searchParams]);

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const counts: Record<string, number> = { All: allProducts.length };
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const uniqueCats = Array.from(new Set(allProducts.map((p) => p.category)));
    return ["All", ...uniqueCats].map((cat) => ({
      name: cat,
      count: counts[cat] || 0,
    }));
  }, [allProducts]);

  const tagOptions: TagOption[] = useMemo(() => {
    const relevantProducts =
      selectedCategory === "All"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory);

    const counts: Record<string, number> = {};
    relevantProducts.forEach((p) => {
      if (p.tag) {
        counts[p.tag] = (counts[p.tag] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCat = p.category.toLowerCase().includes(query);
          const matchTag = p.tag?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat && !matchTag) {
            return false;
          }
        }

        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }

        if (selectedTags.length > 0 && !selectedTags.includes(p.tag)) {
          return false;
        }

        if (p.base_price < priceRange[0] || p.base_price > priceRange[1]) {
          return false;
        }

        if (minRating > 0 && p.rating.rate < minRating) {
          return false;
        }

        if (featuredOnly && !p.featured) {
          return false;
        }

        if (inStockOnly) {
          const totalStock = p.variants
            ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
            : 10;
          if (totalStock <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.base_price - b.base_price;
        if (sortBy === "price-desc") return b.base_price - a.base_price;
        if (sortBy === "rating-desc") return b.rating.rate - a.rating.rate;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (a.featured === b.featured) {
          return b.rating.rate - a.rating.rate;
        }
        return a.featured ? -1 : 1;
      });
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    selectedTags,
    priceRange,
    minRating,
    featuredOnly,
    inStockOnly,
    sortBy,
  ]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedCategory !== "All" ||
      selectedTags.length > 0 ||
      priceRange[0] > minPriceLimit ||
      priceRange[1] < maxPriceLimit ||
      minRating > 0 ||
      featuredOnly ||
      inStockOnly
    );
  }, [
    searchQuery,
    selectedCategory,
    selectedTags,
    priceRange,
    minPriceLimit,
    maxPriceLimit,
    minRating,
    featuredOnly,
    inStockOnly,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (selectedCategory !== "All") count += 1;
    if (selectedTags.length > 0) count += selectedTags.length;
    if (priceRange[0] > minPriceLimit || priceRange[1] < maxPriceLimit) count += 1;
    if (minRating > 0) count += 1;
    if (featuredOnly) count += 1;
    if (inStockOnly) count += 1;
    return count;
  }, [
    searchQuery,
    selectedCategory,
    selectedTags,
    priceRange,
    minPriceLimit,
    maxPriceLimit,
    minRating,
    featuredOnly,
    inStockOnly,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTags([]);
    setPriceRange([minPriceLimit, maxPriceLimit]);
    setMinRating(0);
    setFeaturedOnly(false);
    setInStockOnly(false);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = allProducts.find((p) => p.id === productId);
      const name = product ? product.name : "Product";
      if (exists) {
        showToast(`Removed "${name}" from wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Added "${name}" to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    addItem(product, variant, quantity);
    const variantDesc = variant ? ` (${variant.color || variant.type})` : "";
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ""}"${product.name}${variantDesc}" to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-gray-900/95 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <section className="bg-white border-b border-gray-200 py-6 sm:py-8 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-semibold">Products</span>
            {selectedCategory !== "All" && (
              <>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <span className="text-orange-600 font-semibold">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {selectedCategory === "All" ? "All Products" : `${selectedCategory} Collection`}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Explore our premium catalog with high quality items, verified ratings, and fast delivery.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-9 pr-9 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors shadow-2xs"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <ProductFilterSidebar
                categories={categoryOptions}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                tags={tagOptions}
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                priceRange={priceRange}
                minPriceLimit={minPriceLimit}
                maxPriceLimit={maxPriceLimit}
                onChangePrice={setPriceRange}
                minRating={minRating}
                onChangeMinRating={setMinRating}
                featuredOnly={featuredOnly}
                onChangeFeaturedOnly={setFeaturedOnly}
                inStockOnly={inStockOnly}
                onChangeInStockOnly={setInStockOnly}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex lg:hidden items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-600 transition"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-white px-1.5 py-0.2 text-[10px] font-bold text-orange-600">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <p className="text-xs sm:text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of <span className="font-semibold">{allProducts.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="hidden sm:block h-3.5 w-3.5 text-gray-400" />
                  <label htmlFor="sort-select" className="sr-only">
                    Sort products
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`rounded-lg p-1.5 transition ${
                      viewMode === "grid"
                        ? "bg-white text-orange-600 shadow-2xs"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`rounded-lg p-1.5 transition ${
                      viewMode === "list"
                        ? "bg-white text-orange-600 shadow-2xs"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-gray-400 mr-1">
                  Active Filters:
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    Search: &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    Category: {selectedCategory}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800"
                  >
                    Tag: {tag}
                    <button
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {(priceRange[0] > minPriceLimit || priceRange[1] < maxPriceLimit) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button
                      type="button"
                      onClick={() => setPriceRange([minPriceLimit, maxPriceLimit])}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    Rating: {minRating}★+
                    <button
                      type="button"
                      onClick={() => setMinRating(0)}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {featuredOnly && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    Featured Only
                    <button
                      type="button"
                      onClick={() => setFeaturedOnly(false)}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-800">
                    In Stock Only
                    <button
                      type="button"
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-orange-950 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProducts.map((product) => (
                    <ProductListCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center shadow-2xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-4">
                  <PackageSearch className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md">
                  We couldn&apos;t find any products matching your current filters. Try loosening your criteria or resetting filters to see everything.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-600 transition active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />

          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl overflow-y-auto">
            <ProductFilterSidebar
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              tags={tagOptions}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              priceRange={priceRange}
              minPriceLimit={minPriceLimit}
              maxPriceLimit={maxPriceLimit}
              onChangePrice={setPriceRange}
              minRating={minRating}
              onChangeMinRating={setMinRating}
              featuredOnly={featuredOnly}
              onChangeFeaturedOnly={setFeaturedOnly}
              inStockOnly={inStockOnly}
              onChangeInStockOnly={setInStockOnly}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              activeFiltersCount={activeFiltersCount}
              isMobile={true}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
