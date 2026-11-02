"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/store/useCartStore";
import rawProducts from "@/data/products.json";
import { Product } from "@/types/product";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag,
  ArrowLeft,
  Lock,
  Sparkles,
} from "lucide-react";

export default function CartClient() {
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const addItem = useCartStore((state) => state.addItem);

  // Recommendations for empty cart or upsell
  const recommendations: Product[] = (rawProducts as Product[])
    .filter((p) => p.featured)
    .slice(0, 4);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-white rounded-2xl border border-gray-200" />
              <div className="h-32 bg-white rounded-2xl border border-gray-200" />
            </div>
            <div className="h-80 bg-white rounded-2xl border border-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Free shipping threshold: ₹100
  const freeShippingThreshold = 100;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 15;
  const discountAmount = subtotal * promoDiscountRate;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === "SAVE10" || code === "ESHOP10") {
      setAppliedPromo(code);
      setPromoDiscountRate(0.1); // 10% discount
      showToast(`Promo "${code}" applied! 10% discount has been applied.`);
    } else if (code === "WELCOME20") {
      setAppliedPromo(code);
      setPromoDiscountRate(0.2); // 20% discount
      showToast(`Promo "${code}" applied! 20% discount has been applied.`);
    } else {
      setPromoError("Invalid code. Try 'SAVE10' for 10% off.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    setPromoCode("");
    showToast("Promo code removed.");
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    showToast(`Removed "${item.name}" from cart`);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderCompleted(true);
      clearCart();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-gray-900/95 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Bar */}
      <section className="bg-white border-b border-gray-200 py-3.5 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/products" className="hover:text-orange-600 transition">
              Products
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-semibold">Shopping Cart</span>
          </nav>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Order Completed Success Modal / Banner */}
        {orderCompleted ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto my-12 animate-in zoom-in-95">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Order Confirmed!
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you for your order! We have received your purchase and are getting it ready for delivery.
            </p>
            <div className="mt-6 rounded-2xl bg-gray-50 p-4 border border-gray-100 text-xs text-gray-500 max-w-sm mx-auto">
              <span>Order Reference: </span>
              <strong className="text-gray-900">
                #ESHOP-{Math.floor(100000 + Math.random() * 900000)}
              </strong>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                onClick={() => setOrderCompleted(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-orange-600 transition"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-14 text-center shadow-xs">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-5">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Your Shopping Cart is Empty
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Explore our latest electronics, fashion, toys, and cosmetics!
            </p>
            <div className="mt-7">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-orange-600 transition active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Popular Items Row */}
            <div className="mt-14 pt-10 border-t border-gray-100 text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recommended For You
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3 hover:bg-gray-50 transition"
                  >
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={prod.default_image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                        ₹ {prod.base_price.toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          addItem(prod, undefined, 1);
                          showToast(`Added "${prod.name}" to cart`);
                        }}
                        className="mt-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        + Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart State */
          <div>
            {/* Header with Title and Clear Cart */}
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                  <span>Shopping Cart</span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                    {totalCount} {totalCount === 1 ? "item" : "items"}
                  </span>
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Review your items before proceeding to checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your shopping cart?")) {
                    clearCart();
                    showToast("Shopping cart cleared");
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear entire cart</span>
              </button>
            </div>

            {/* Main Cart Grid: Left Items List, Right Summary */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Items Column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free shipping progress notification */}
                <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 shadow-2xs">
                  {isFreeShipping ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <Truck className="h-4 w-4 text-emerald-600" />
                      <span>Congratulations! You qualify for FREE Express Shipping!</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-orange-900 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-4 w-4 text-orange-600" />
                          <span>
                            Add <strong>₹{(freeShippingThreshold - subtotal).toFixed(2)}</strong> more to get FREE Delivery!
                          </span>
                        </span>
                        <span>{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-orange-200/80 overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const lineTotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-orange-200 hover:shadow-sm transition-all"
                      >
                        {/* Image & Product Title Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Image */}
                          <Link
                            href={`/products/${item.productId}`}
                            className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </Link>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                              {item.category}
                            </span>

                            <Link
                              href={`/products/${item.productId}`}
                              className="block mt-1 text-sm sm:text-base font-bold text-gray-900 hover:text-orange-600 transition truncate"
                            >
                              {item.name}
                            </Link>

                            {/* Variant info */}
                            {item.variantTitle && (
                              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                {item.variantColorCode && (
                                  <span
                                    className="h-3 w-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.variantColorCode }}
                                  />
                                )}
                                <span>Option: <strong className="text-gray-700">{item.variantTitle}</strong></span>
                              </div>
                            )}

                            {/* Unit Price */}
                            <p className="mt-1 text-xs text-gray-400 font-medium">
                              Unit Price: <span className="text-gray-700 font-bold">₹{item.price.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Stepper & Line Total & Remove */}
                        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Stepper */}
                          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => {
                                if (item.quantity === 1) {
                                  handleRemoveItem(item);
                                } else {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition shadow-2xs"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-9 text-center text-xs font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= item.stock}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition shadow-2xs"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right min-w-[5rem]">
                            <span className="text-[10px] text-gray-400 block font-medium">Total</span>
                            <span className="text-base font-extrabold text-gray-900">
                              ₹ {lineTotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            aria-label={`Remove ${item.name}`}
                            className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                    Order Summary
                  </h3>

                  {/* Summary rows */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Items Subtotal ({totalCount} items)</span>
                      <span className="font-bold text-gray-900">
                        ₹ {subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Estimated Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-600 uppercase text-xs">FREE</strong>
                        ) : (
                          <strong className="text-gray-900">₹{shippingFee.toFixed(2)}</strong>
                        )}
                      </span>
                    </div>

                    {/* Applied discount row */}
                    {appliedPromo && discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 font-semibold">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          Coupon ({appliedPromo})
                        </span>
                        <span>- ₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        ₹ {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="border-t border-gray-100 pt-5">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{appliedPromo} (10% OFF)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs text-rose-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">
                          Have a coupon code?
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. SAVE10"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 uppercase focus:border-orange-500 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-[11px] text-rose-600 font-medium">
                            {promoError}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400">
                          Try code <code className="font-bold text-orange-600">SAVE10</code> for 10% off.
                        </p>
                      </form>
                    )}
                  </div>

                  {/* Checkout CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isCheckingOut || items.length === 0}
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 px-6 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition active:scale-98 disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Proceed to Checkout</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Trust guarantees */}
                  <div className="border-t border-gray-100 pt-5 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>256-Bit SSL Encrypted Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span>30-Day Money Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span>Tracked Nationwide Express Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
