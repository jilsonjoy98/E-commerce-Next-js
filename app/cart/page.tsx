import CartClient from "@/components/cart/CartClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | eShop",
  description: "View and manage items in your shopping cart. Fast checkout with secure payments.",
};

export default function CartPage() {
  return <CartClient />;
}
