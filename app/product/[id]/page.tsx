// app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Store,
  Check,
} from "lucide-react";
import { productsApi, type Product } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import { useAuth } from "@/lib/auth-context";
import ReviewList from "@/components/custom/review/ReviewList";

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className="w-4 h-4"
            fill={s <= Math.round(rating) ? "#FBBF24" : "none"}
            stroke={s <= Math.round(rating) ? "#FBBF24" : "#D1D5DB"}
          />
        ))}
      </div>
      {count != null && (
        <span className="text-sm text-gray-400">({count} customer {count === 1 ? "review" : "reviews"})</span>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const images = [
    product?.image_url,
    product?.image_url_2,
  ].filter(Boolean) as string[];

  const stock = product?.quantity ?? 0;
  const outOfStock = stock <= 0;

  useEffect(() => {
    if (!id) return;
    productsApi.getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  async function handleAddToCart() {
    if (!product) return;

    if (!user?.id) {
      setCartError("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    if (outOfStock) {
      setCartError("This product is out of stock.");
      return;
    }

    if (quantity > stock) {
      setCartError(`Only ${stock} item(s) available in stock.`);
      return;
    }

    setAddingToCart(true);
    setCartError(null);
    setAddedToCart(false);

    try {
      await addToCart({
        user_id: user.id,
        product_id: product.id,
        vendor_id: product.vendor_id,
        price: Number(product.price),
        quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      setCartError(err.message ?? "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl bg-gray-100 animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 h-24 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-1/3" />
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-1/4" />
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-sm">{error ?? "Product not found."}</p>
      </div>
    );
  }

  const vendor = product.vendor;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* ── Main product section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100">
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-6"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Package className="w-20 h-20" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0
                      ${activeImage === i ? "border-amber-400 shadow-md" : "border-gray-100 hover:border-gray-300"}`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${i + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain p-2 bg-white"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: product details */}
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                {product.name}
              </h1>
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </div>
                <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <StarRating rating={4} count={1} />

            <p className="text-2xl font-bold text-amber-500">
              LKR {Number(product.price).toLocaleString()}
            </p>

            {/* Stock indicator */}
            {outOfStock ? (
              <p className="text-sm font-semibold text-red-500">Out of stock</p>
            ) : stock <= 5 ? (
              <p className="text-sm font-medium text-amber-600">Only {stock} left in stock</p>
            ) : (
              <p className="text-sm text-gray-400">{stock} in stock</p>
            )}

            {product.description && (
              <p className="text-sm text-gray-500 leading-[1.8] border-t border-gray-100 pt-4">
                {product.description}
              </p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-gray-500">Colors</span>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-600 bg-white"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={outOfStock}
                  className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={outOfStock || quantity >= stock}
                  className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock || addingToCart}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    ADDED
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {addingToCart ? "ADDING..." : outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                  </>
                )}
              </button>
            </div>

            {cartError && (
              <p className="text-xs text-red-500">{cartError}</p>
            )}

            {/* Meta info */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {product.category && (
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">Category: </span>
                  {product.category}
                </p>
              )}
              {product.brand && (
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">Brand: </span>
                  {product.brand}
                </p>
              )}
              {product.sku && (
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">SKU: </span>
                  {product.sku}
                </p>
              )}
              {product.weight && (
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">Weight: </span>
                  {product.weight} {product.weight_unit ?? ""}
                </p>
              )}
              {product.dimensions && (
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">Dimensions: </span>
                  {product.dimensions}
                </p>
              )}
            </div>

            {vendor && (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center">
                    {vendor.image1 ? (
                      <Image
                        src={vendor.image1}
                        alt={vendor.vendor_name ?? "Vendor"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Store className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {vendor.vendor_name ?? "Unknown vendor"}
                    </p>
                    {(vendor.address || vendor.branch) && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {vendor.address || vendor.branch}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <ReviewList serviceId={product.id} />
        </div>
      </div>
    </div>
  );
}