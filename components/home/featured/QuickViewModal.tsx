"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, Heart, Check, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

interface QuickViewModalDialogProps {
  product: Product;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

function QuickViewModalDialog({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: QuickViewModalDialogProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const currentImage = selectedVariant?.image || product.default_image;
  const currentPrice = selectedVariant?.price ?? product.base_price;
  const currentStock = selectedVariant?.stock ?? 30;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant || undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 text-gray-500 shadow hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative flex flex-col items-center justify-center bg-gray-50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-sm">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-all duration-300"
                priority
              />
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                <Sparkles className="h-3 w-3" />
                Featured Product
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {product.category} • {product.tag}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Tag */}
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                {product.category}
              </div>

              {/* Title */}
              <h2 id="modal-headline" className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-semibold text-gray-800">
                    {product.rating.rate.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">
                  {product.rating.count} verified reviews
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  In Stock ({currentStock} available)
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Option / Color:{" "}
                    <span className="font-normal text-gray-900 ml-1">
                      {selectedVariant?.color || selectedVariant?.type}
                    </span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-500"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {v.color_code && (
                            <span
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: v.color_code }}
                            />
                          )}
                          <span>{v.color || v.type}</span>
                          {v.price !== product.base_price && (
                            <span className="text-gray-400 text-[11px]">
                              (${v.price})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Perks mini strip */}
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>100% Genuine Warranty</span>
                </div>
              </div>

              {/* Customer Reviews Preview */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                    Top Review
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 border border-gray-100">
                    <div className="flex items-center justify-between font-semibold text-gray-900 mb-1">
                      <span>{product.reviews[0].user}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: product.reviews[0].rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="italic text-gray-600">&ldquo;{product.reviews[0].comment}&rdquo;</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="px-2.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold shadow-sm transition-all duration-200 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.99]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart • ${(currentPrice * quantity).toFixed(2)}
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`rounded-lg p-2.5 border transition-colors ${
                  isWishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"
                    : "border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickViewModal(props: QuickViewModalProps) {
  if (!props.isOpen || !props.product) return null;
  return <QuickViewModalDialog key={props.product.id} {...props} product={props.product} />;
}
