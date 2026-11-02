"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, ArrowRight, ShoppingBag, Check, Sparkles, Truck } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

interface ProductListCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
}

export default function ProductListCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductListCardProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const displayImage = selectedVariant?.image || product.default_image;
  const displayPrice = selectedVariant?.price ?? product.base_price;
  const currentStock = selectedVariant?.stock ?? 30;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col sm:flex-row gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition-all duration-300 hover:border-orange-200 hover:shadow-lg cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full sm:w-48 sm:min-w-[12rem] overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-xs">
            {product.category}
          </span>
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
              <Sparkles className="h-2.5 w-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-xs ${
            isWishlisted
              ? "bg-white text-rose-500"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>

        {selectedVariant && selectedVariant.color && (
          <div className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-xs">
            {selectedVariant.color}
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header row: category / tag and rating */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              {product.tag}
            </span>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="ml-1 font-semibold text-gray-800">
                  {product.rating.rate.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-[11px]">
                ({product.rating.count} reviews)
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            title={product.name}
            className="mt-2 text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Swatches */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Options:</span>
              <div className="flex items-center gap-1.5">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      title={`${variant.color || variant.type} - ₹${variant.price}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(variant);
                      }}
                      className={`relative h-5 w-5 rounded-full border transition-all duration-150 ${
                        isSelected
                          ? "ring-2 ring-orange-500 ring-offset-1 scale-110 border-white"
                          : "border-gray-300 hover:scale-110"
                      }`}
                      style={{ backgroundColor: variant.color_code || "#e5e7eb" }}
                    >
                      <span className="sr-only">{variant.color || variant.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipping badge */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <Truck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Free Shipping Available • In Stock ({currentStock})</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5 font-medium">Price</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              ₹ {displayPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={isAdded ? "Added to cart" : `Add ${product.name} to cart`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95 ${
                isAdded
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
