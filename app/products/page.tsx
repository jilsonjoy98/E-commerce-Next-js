import { Suspense } from "react";
import ProductsClient from "@/components/products/ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | eShop",
  description: "Browse our complete catalog of electronics, fashion, toys, and cosmetics with interactive filters and fast shipping.",
};

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 animate-pulse">
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-64 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-1">
            <div className="h-96 rounded-2xl bg-white border border-gray-200 p-5" />
          </div>
          <div className="lg:col-span-3 space-y-5">
            <div className="h-14 rounded-2xl bg-white border border-gray-200" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-white border border-gray-200 p-4"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient />
    </Suspense>
  );
}
