import { Suspense } from "react";
import rawProducts from "@/data/products.json";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const products = rawProducts as Product[];
  const paths: { id: string }[] = [];
  products.forEach((p) => {
    paths.push({ id: p.id });
    if (p.slug && p.slug !== p.id) {
      paths.push({ id: p.slug });
    }
  });
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (rawProducts as Product[]).find(
    (p) => p.id === id || p.slug === id
  );

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const imageUrl = product.default_image;

  return {
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      product.tag,
      "online store",
      "buy online",
      `price ₹${product.base_price}`,
    ],
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = rawProducts as Product[];
  const product = products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-pulse">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-3/4 bg-gray-200 rounded" />
              <div className="h-6 w-48 bg-gray-100 rounded" />
              <div className="h-12 w-40 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-100 rounded" />
              <div className="h-14 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
