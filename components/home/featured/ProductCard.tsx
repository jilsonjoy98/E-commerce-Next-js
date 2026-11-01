"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, Eye, ShoppingBag, Check, Sparkles } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
}

export default function ProductCard({
  product,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const displayImage = selectedVariant?.image || product.default_image;
  const displayPrice = selectedVariant?.price ?? product.base_price;

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

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-orange-200 cursor-pointer"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badges on Image */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
            <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Quick Action Buttons (Wishlist & Quick View) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm ${
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

            {/* Quick View Button */}
            <button
              type="button"
              onClick={handleQuickViewClick}
              aria-label="Quick view product"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-orange-600 hover:scale-110 active:scale-95 shadow-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Tag Overlay at bottom of image if variant selected */}
          {selectedVariant && selectedVariant.color && (
            <div className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-xs">
              {selectedVariant.color}
            </div>
          )}
        </div>

        {/* Color Swatches if product has variants */}
        {product.variants && product.variants.length > 1 && (
          <div className="mt-3 flex items-center gap-1.5">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  title={`${variant.color || variant.type} - $${variant.price}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`group/swatch relative h-5 w-5 rounded-full border transition-all duration-150 ${
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
            <span className="ml-1 text-[11px] text-gray-400 font-medium">
              {product.variants.length} options
            </span>
          </div>
        )}

        {/* Product Info */}
        <div className="mt-2.5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="ml-1 font-semibold text-gray-800">
                {product.rating.rate.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-[11px]">
              ({product.rating.count})
            </span>
          </div>

          {/* Product Name */}
          <h3
            title={product.name}
            className="mt-1.5 text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors"
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Add to Cart Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-gray-400 block -mb-0.5 font-medium">Price</span>
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={isAdded ? "Added to cart" : `Add ${product.name} to cart`}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95 ${
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
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
