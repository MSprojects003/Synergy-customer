// components/custom/checkout/CheckoutBox.tsx
"use client";

import { MapPin, Truck, CalendarCheck } from "lucide-react";

type CheckoutDisplayItem = {
  id: string;
  product_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  currency?: string;
};

type Props = {
  items: CheckoutDisplayItem[];
  address?: string | null;
  city?: string | null;
  onCheckout: () => void;
  checkingOut?: boolean;
};


function estimatedDelivery(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Row({ label, value, bold = false, accent = false }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0">
      <span className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-500"}`}>{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-amber-600" : bold ? "text-gray-900" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}

export default function CheckoutBox({ items, address, city, onCheckout, checkingOut }: Props) {
  const currency = items[0]?.currency ?? "LKR";
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-base font-bold text-gray-900">Order Summary</p>
      </div>

      {/* Summary rows */}
      <div className="px-5">
        <Row label="Items" value={String(totalQty)} />
        <Row label="Sub Total" value={`${currency} ${subtotal.toLocaleString()}`} />
        <Row label="Shipping" value={shipping === 0 ? "Free" : `${currency} ${shipping}`} accent={shipping === 0} />
      </div>

      {/* Divider + Total */}
      <div className="px-5 pt-3 pb-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">{currency} {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Delivery section */}
      <div className="px-5 pb-4 space-y-3 border-t border-gray-100 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Delivery Details</p>

        {/* Location */}
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-3.5 py-3">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Deliver to</p>
            {address || city ? (
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {[address, city].filter(Boolean).join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic mt-0.5">No address saved</p>
            )}
          </div>
        </div>

        {/* Free delivery badge */}
        <div className="flex items-center gap-2.5 bg-amber-50 rounded-xl px-3.5 py-3">
          <Truck className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm font-medium text-amber-700">Free Delivery</p>
        </div>

        {/* Estimated date */}
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-3">
          <CalendarCheck className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Estimated Delivery</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{estimatedDelivery()}</p>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={onCheckout}
          disabled={items.length === 0 || checkingOut}
          className="w-full py-3.5 bg-amber-900 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {checkingOut ? "Processing…" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}