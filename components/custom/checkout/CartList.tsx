// components/custom/cart/CartList.tsx
"use client";

import { type CartItem } from "@/lib/api/cart";
import CartCard from "./CartCard";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

type Props = {
  items: CartItem[];
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  savingIds?: Set<string>;
};

export default function CartList({ items, onRemove, onIncrease, onDecrease, savingIds }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
        <p className="text-sm text-gray-400 mt-1">Add items to get started.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 px-6 py-3 bg-amber-400">
        <p className="text-sm font-semibold text-white">Product</p>
        <p className="text-sm font-semibold text-white text-right">Price</p>
        <p className="text-sm font-semibold text-white text-center">Quantity</p>
        <p className="text-sm font-semibold text-white text-right">Subtotal</p>
      </div>

      <div className="px-6">
        {items.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            saving={savingIds?.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
}