import CartClient from "@/components/cart/CartClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your selected items, calculate delivery fees, apply discount codes, and complete your checkout securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartClient />;
}
