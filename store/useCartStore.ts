"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, ProductVariant } from "@/types/product";
import { useState, useEffect } from "react";

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  variantId?: string;
  variantTitle?: string;
  variantColorCode?: string;
  stock: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, variant?: ProductVariant, quantity = 1) => {
        const variantId = variant?.id || "default";
        const cartItemId = `${product.id}-${variantId}`;
        const price = variant?.price ?? product.base_price;
        const image = variant?.image || product.default_image;
        const stock = variant?.stock ?? 30;
        const variantTitle = variant?.color || variant?.type;
        const variantColorCode = variant?.color_code;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQuantity = Math.min(stock, currentItem.quantity + quantity);
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price,
            image,
            category: product.category,
            variantId: variant?.id,
            variantTitle,
            variantColorCode,
            stock,
            quantity: Math.min(stock, Math.max(1, quantity)),
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== cartItemId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.id === cartItemId) {
                return {
                  ...item,
                  quantity: Math.min(item.stock, quantity),
                };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "eshop_cart_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useCartCount(): number {
  const [mounted, setMounted] = useState(false);
  const totalCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? totalCount : 0;
}
