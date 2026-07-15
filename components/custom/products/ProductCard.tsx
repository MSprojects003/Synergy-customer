"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/api/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {/* First Image */}
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}

          {/* Second Image (Hover Effect) */}
          {product.image_url_2 && (
            <Image
              src={product.image_url_2}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
            />
          )}

          {/* Quick Add to Cart Button */}
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => e.preventDefault()}
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
              {product.category || "General"}
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

          {/* Price */}
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
    </Link>
  );
}