// components/custom/cart/CartCard.tsx
"use client";

import Image from "next/image";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { type CartItem } from "@/lib/api/cart";

type Props = {
  item: CartItem;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  saving?: boolean;
};

export default function CartCard({ item, onRemove, onIncrease, onDecrease, saving }: Props) {
  const product = item.product;
  const price = product?.price ?? 0;
  const subtotal = price * item.quantity;
  const stock = product?.quantity ?? 0;
  const vendorId = product?.vendor_id ?? "";
  const atMaxStock = item.quantity >= stock;

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 py-5 border-b border-gray-100 last:border-b-0">
      {/* Product info */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <Image
            src={product?.image_url ?? "/placeholder.png"}
            alt={product?.name ?? "Product"}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {product?.name ?? "Unknown product"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">LKR {price.toLocaleString()}</p>
          {atMaxStock && (
            <p className="text-[11px] text-amber-600 mt-1 font-medium">
              Max available stock reached
            </p>
          )}
        </div>
      </div>

      {/* Price */}
      <p className="text-sm font-medium text-gray-700 text-right whitespace-nowrap">
        LKR {price.toLocaleString()}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDecrease(item.id)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3 h-3" />
        </button>

        <span className="w-6 text-center text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
          {item.quantity}
          {saving && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
        </span>

        <button
          type="button"
          onClick={() => onIncrease(item.id)}
          disabled={atMaxStock}
          title={atMaxStock ? "No more stock available" : undefined}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Subtotal */}
      <p className="text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
        LKR {subtotal.toLocaleString()}
      </p>
    </div>
  );
}