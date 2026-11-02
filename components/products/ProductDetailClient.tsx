"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/product";
import ProductCard from "@/components/home/featured/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import LiveViewerBadge from "@/components/products/LiveViewerBadge";
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  ChevronRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Share2,
  PackageCheck,
  Award,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const [activeImage, setActiveImage] = useState<string>(
    selectedVariant?.image || product.default_image
  );

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setActiveImage(variant.image);
    }
  };

  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const [relatedWishlist, setRelatedWishlist] = useState<string[]>([]);

  const currentPrice = selectedVariant?.price ?? product.base_price;
  const currentStock = selectedVariant?.stock ?? 30;

  const galleryImages = [
    product.default_image,
    ...(product.variants?.map((v) => v.image).filter(Boolean) || []),
  ].filter((url, idx, self) => self.indexOf(url) === idx);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, selectedVariant || undefined, quantity);
    const variantDesc = selectedVariant ? ` (${selectedVariant.color || selectedVariant.type})` : "";
    setIsAdded(true);
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ""}"${product.name}${variantDesc}" to cart!`);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      showToast(next ? `Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
      return next;
    });
  };

  const handleToggleRelatedWishlist = (prodId: string) => {
    setRelatedWishlist((prev) => {
      const exists = prev.includes(prodId);
      const prod = relatedProducts.find((p) => p.id === prodId);
      const name = prod ? prod.name : "Product";
      if (exists) {
        showToast(`Removed "${name}" from wishlist`);
        return prev.filter((id) => id !== prodId);
      } else {
        showToast(`Added "${name}" to wishlist`);
        return [...prev, prodId];
      }
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast  */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-gray-900/95 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/*  Breadcrumb  */}
      <section className="bg-white border-b border-gray-200 py-3.5 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <Link href="/products" className="hover:text-orange-600 transition">
              Products
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-orange-600 transition"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all products</span>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-inner group">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-xs">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Pick
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Share product"
                  className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 backdrop-blur-md transition-all hover:bg-white hover:text-orange-600 shadow-sm hover:scale-105"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, i) => {
                    const isSelected = activeImage === imgUrl;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                            : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${product.name} thumbnail ${i + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-gray-50/70 p-4 border border-gray-100 text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Free Express Delivery</p>
                    <p className="text-[11px] text-gray-500">2 - 4 business days</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Genuine Guarantee</p>
                    <p className="text-[11px] text-gray-500">100% verified original</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">30 Days Easy Returns</p>
                    <p className="text-[11px] text-gray-500">Hassle-free return policy</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Official Warranty</p>
                    <p className="text-[11px] text-gray-500">1 Year brand warranty</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                    {product.tag}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate)
                            ? "fill-amber-400 text-amber-400"
                            : i < product.rating.rate
                            ? "fill-amber-200 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-bold text-gray-900">
                      {product.rating.rate.toFixed(1)}
                    </span>
                  </div>

                  <span className="text-gray-300">•</span>

                  <button
                    type="button"
                    onClick={() => setActiveTab("reviews")}
                    className="text-xs sm:text-sm font-semibold text-orange-600 hover:underline"
                  >
                    {product.rating.count} verified customer reviews
                  </button>
                </div>

                <div className="mt-4">
                  <LiveViewerBadge productId={product.id} />
                </div>

                <div className="mt-4 flex items-baseline gap-4 border-b border-gray-100 pb-5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    ₹ {currentPrice.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <PackageCheck className="h-3.5 w-3.5" />
                    In Stock ({currentStock} units left)
                  </span>
                </div>

                <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {product.variants && product.variants.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Choose Option / Color:{" "}
                        <span className="font-semibold text-orange-600 ml-1">
                          {selectedVariant?.color || selectedVariant?.type}
                        </span>
                      </label>
                      <span className="text-xs text-gray-400">
                        {product.variants.length} available
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {product.variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => handleSelectVariant(variant)}
                            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                              isSelected
                                ? "border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs ring-2 ring-orange-500/20"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {variant.color_code && (
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-gray-300 shadow-2xs"
                                style={{ backgroundColor: variant.color_code }}
                              />
                            )}
                            <span>{variant.color || variant.type}</span>
                            {variant.price !== product.base_price && (
                              <span className="text-[11px] text-gray-500 font-normal">
                                (₹{variant.price.toFixed(2)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity  */}
                <div className="mt-7 flex flex-wrap items-center gap-3.5 pt-5 border-t border-gray-100">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-2xs">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-bold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-bold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-bold shadow-sm transition-all duration-200 active:scale-98 ${
                      isAdded
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        <span>
                          Add to Cart • ₹{(currentPrice * quantity).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                      isWishlisted
                        ? "border-rose-200 bg-rose-50 text-rose-500 shadow-2xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-rose-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 transition-transform hover:scale-110 ${
                        isWishlisted ? "fill-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between text-xs text-gray-400">
                <span>Product ID: <strong className="text-gray-700">{product.id}</strong></span>
                <span>Category: <strong className="text-gray-700">{product.category}</strong></span>
                <span>Shipping: <strong className="text-emerald-600">Free</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex border-b border-gray-200 gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative ${
                activeTab === "description"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Description & Highlights
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative ${
                activeTab === "specs"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Specifications
              {activeTab === "specs" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative ${
                activeTab === "reviews"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Customer Reviews ({product.reviews?.length || product.rating.count})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === "description" && (
            <div className="pt-6 space-y-4 max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>{product.description}</p>
              <p>
                Engineered with high performance and longevity in mind, this item embodies modern craftsmanship with premium materials. Whether you are upgrading your setup or looking for the ideal gift, the {product.name} delivers consistent excellence and reliability.
              </p>
              <div className="mt-4 rounded-xl bg-orange-50 p-4 border border-orange-100">
                <h4 className="font-bold text-orange-900 mb-1">Key Advantages</h4>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-orange-800">
                  <li>Curated by our expert merchandise team for superior quality</li>
                  <li>Fully compatible and comes ready with official accessories</li>
                  <li>Eligible for 100% money-back satisfaction guarantee</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-2xl text-xs sm:text-sm">
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Product Name</dt>
                  <dd className="mt-1 font-bold text-gray-900">{product.name}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Category</dt>
                  <dd className="mt-1 font-bold text-gray-900">{product.category}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Tag / Type</dt>
                  <dd className="mt-1 font-bold text-gray-900">{product.tag}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Base Price</dt>
                  <dd className="mt-1 font-bold text-gray-900">₹{product.base_price.toFixed(2)}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Total Variants</dt>
                  <dd className="mt-1 font-bold text-gray-900">{product.variants?.length || 1} available</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <dt className="text-gray-400 font-medium">Warranty</dt>
                  <dd className="mt-1 font-bold text-emerald-600">1 Year Brand Warranty</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-gray-50 p-6 border border-gray-100 mb-6">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-extrabold text-gray-900">
                    {product.rating.rate.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start text-amber-400 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium">
                    Based on {product.rating.count} ratings
                  </p>
                </div>

                <div className="sm:border-l sm:border-gray-200 sm:pl-6 text-xs text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-800">
                    96% of buyers recommend this product
                  </p>
                  <p className="mt-1 text-gray-500">
                    All reviews are submitted by verified purchasers and checked for authenticity.
                  </p>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                            {rev.user.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                              {rev.user}
                            </span>
                            <span className="text-[11px] text-gray-400">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-8 text-center text-xs text-gray-500">
                  No individual written reviews yet for this product. Be the first to share your experience!
                </div>
              )}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Related Products
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  More top rated picks in {product.category}
                </p>
              </div>

              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  isWishlisted={relatedWishlist.includes(relProduct.id)}
                  onToggleWishlist={handleToggleRelatedWishlist}
                  onAddToCart={(p, v) => {
                    addItem(p, v, 1);
                    const desc = v ? ` (${v.color || v.type})` : "";
                    showToast(`Added "${p.name}${desc}" to cart!`);
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
