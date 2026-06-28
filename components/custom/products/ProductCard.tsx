"use client";

import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    rating: number;
    image: string;
    imageBack: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
        />
        <Image
          src={product.imageBack}
          alt={`${product.name} alternate view`}
          fill
          className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
        />

        {/* Quick action */}
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gray-900 hover:text-white"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <p className="text-[11px] uppercase tracking-[0.08em] text-gray-500 font-semibold">
            {product.category}
          </p>
        </div>

        <h3 className="font-semibold text-[15px] leading-snug text-gray-900 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">{product.rating}</span>
        </div>

        {/* Price + Divider */}
        <div className="mt-1 pt-1 border-t border-gray-100 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-gray-500">Rs.</span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              {product.price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-600">In stock</span>
        </div>
      </div>
    </div>
  );
}
