// app/checkout/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  getCartByUserId,
  updateCartQuantity,
  removeFromCart,
  type CartItem,
} from "@/lib/api/cart";
import { createOrdersFromCart } from "@/lib/api/orders";   // ← Import this
import CartList from "@/components/custom/checkout/CartList";
import CheckoutBox from "@/components/custom/checkout/CheckoutBox";

const SAVE_DELAY_MS = 600;

export default function CheckoutPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [address, setAddress] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lastSaved = useRef<Record<string, number>>({});

  // Load cart
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getCartByUserId(user.id)
      .then((data) => {
        setItems(data);
        data.forEach((i) => (lastSaved.current[i.id] = i.quantity));
      })
      .catch((e) => setActionError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Fetch user address
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("customers")
      .select("address, city")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAddress(data.address ?? null);
          setCity(data.city ?? null);
        }
      });
  }, [user?.id]);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  const scheduleSave = useCallback((id: string, qty: number, unitPrice: number) => {
    if (timers.current[id]) clearTimeout(timers.current[id]);

    setSavingIds((prev) => new Set(prev).add(id));

    timers.current[id] = setTimeout(async () => {
      try {
        await updateCartQuantity(id, qty, unitPrice);
        lastSaved.current[id] = qty;
      } catch (err: any) {
        setActionError(err.message);
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? { ...i, quantity: lastSaved.current[id], total_price: unitPrice * lastSaved.current[id] }
              : i
          )
        );
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, SAVE_DELAY_MS);
  }, []);

  function handleIncrease(id: string) {
    setActionError(null);
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id || !i.product) return i;
        const stock = i.product.quantity ?? 0;
        if (i.quantity >= stock) return i;
        const newQty = i.quantity + 1;
        scheduleSave(id, newQty, i.product.price);
        return { ...i, quantity: newQty, total_price: i.product.price * newQty };
      })
    );
  }

  function handleDecrease(id: string) {
    setActionError(null);
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id || !i.product || i.quantity <= 1) return i;
        const newQty = i.quantity - 1;
        scheduleSave(id, newQty, i.product.price);
        return { ...i, quantity: newQty, total_price: i.product.price * newQty };
      })
    );
  }

  async function handleRemove(id: string) {
    if (timers.current[id]) clearTimeout(timers.current[id]);
    delete timers.current[id];
    delete lastSaved.current[id];

    setActionError(null);
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await removeFromCart(id);
    } catch (err: any) {
      setActionError(err.message);
      setItems(prevItems);
    }
  }

  // ==================== CHECKOUT LOGIC ====================
  async function handleCheckout() {
    if (!user?.id || items.length === 0) return;

    setCheckingOut(true);
    setActionError(null);

    try {
      await createOrdersFromCart(
        user.id,
        items,
        "cash",                    // Change to "card" if needed
        address || undefined
      );

      alert("✅ Order(s) placed successfully!");
      window.location.href = "/orders";   // Redirect to orders page
    } catch (err: any) {
      setActionError(err.message || "Failed to place order");
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-400 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
          {actionError && <p className="text-xs text-red-500 mt-2">{actionError}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <CartList
            items={items}
            onRemove={handleRemove}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            savingIds={savingIds}
          />

          <CheckoutBox
            items={items.map((i) => ({
              id: i.id,
              product_id: i.product_id,
              name: i.product?.name ?? "",
              image: i.product?.image_url ?? "",
              price: i.product?.price ?? 0,
              quantity: i.quantity,
              currency: "LKR",
            }))}
            address={address}
            city={city}
            onCheckout={handleCheckout}
            checkingOut={checkingOut}
          />
        </div>
      </div>
    </div>
  );
}