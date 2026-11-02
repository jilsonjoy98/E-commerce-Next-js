"use client";

import { useMemo, useState } from "react";
import rawProducts from "@/data/products.json";
import { Product, ProductVariant } from "@/types/product";
import ProductCard from "./ProductCard";
import { SlidersHorizontal, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function Featured() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cast imported json to typed Product array and filter featured items
  const allFeaturedProducts: Product[] = useMemo(() => {
    return (rawProducts as Product[]).filter((p) => p.featured);
  }, []);

  // Compute category options with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = { All: allFeaturedProducts.length };
    allFeaturedProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const uniqueCats = Array.from(new Set(allFeaturedProducts.map((p) => p.category)));
    return ["All", ...uniqueCats].map((cat) => ({
      name: cat,
      count: counts[cat] || 0,
    }));
  }, [allFeaturedProducts]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return allFeaturedProducts;
    return allFeaturedProducts.filter((p) => p.category === selectedCategory);
  }, [allFeaturedProducts, selectedCategory]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = allFeaturedProducts.find((p) => p.id === productId);
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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-gray-900/95 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Explore our hand-selected bestsellers and top-rated favorites across all categories.
          </p>
        </div>

        {/* View All link */}
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            <span>Browse all products</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mr-2">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25 ring-2 ring-orange-500 ring-offset-1"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-base font-semibold text-gray-700">No featured products found in this category.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="mt-3 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition"
          >
            Show All Featured Products
          </button>
        </div>
      )}
    </section>
  );
}
