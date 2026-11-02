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
      title: "Product Not Found | eShop",
      description: "The requested product does not exist.",
    };
  }

  return {
    title: `${product.name} | eShop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
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
