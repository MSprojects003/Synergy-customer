// lib/api/cart.ts
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  total_price: number;
  is_cleared: boolean;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    quantity: number | null; // stock
    vendor_id: string;
  } | null;
};

export type AddToCartInput = {
  user_id: string;
  product_id: string;
  vendor_id: string;
  price: number;
  quantity?: number;
};

/** Fetch active (is_cleared=false) cart items for a user, with product details */
export async function getCartByUserId(userId: string): Promise<CartItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cart")
    .select(`
      *,
      product:products (
        id,
        name,
        price,
        image_url,
        quantity,
        vendor_id
      )
    `)
    .eq("user_id", userId)
    .eq("is_cleared", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch cart: ${error.message}`);
  return (data ?? []) as CartItem[];
}

/** Add product to cart. If item already exists, increment quantity instead. */
export async function addToCart(input: AddToCartInput): Promise<void> {
  const supabase = createClient();
  const qty = input.quantity ?? 1;

  // Check if already in cart
  const { data: existing } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", input.user_id)
    .eq("product_id", input.product_id)
    .eq("is_cleared", false)
    .maybeSingle();

  if (existing) {
    // Update quantity + total_price
    const newQty = existing.quantity + qty;
    const { error } = await supabase
      .from("cart")
      .update({
        quantity: newQty,
        total_price: input.price * newQty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) throw new Error(`Failed to update cart: ${error.message}`);
  } else {
    // Insert new item
    const { error } = await supabase.from("cart").insert({
      user_id: input.user_id,
      product_id: input.product_id,
      vendor_id: input.vendor_id,
      quantity: qty,
      total_price: input.price * qty,
      is_cleared: false,
    });

    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
  }
}

/** Update quantity for a cart item */
/** Update quantity for a cart item, blocked client-side if it would exceed stock */
export async function updateCartQuantity(
  cartItemId: string,
  newQty: number,
  unitPrice: number,
  stock?: number | null
): Promise<void> {
  if (stock != null && newQty > stock) {
    throw new Error(`Only ${stock} item(s) available in stock`);
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("cart")
    .update({
      quantity: newQty,
      total_price: unitPrice * newQty,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartItemId);

  if (error) throw new Error(`Failed to update quantity: ${error.message}`);
}


/** Remove a single item from cart */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("cart").delete().eq("id", cartItemId);
  if (error) throw new Error(`Failed to remove item: ${error.message}`);
}

/** Mark all cart items as cleared (after checkout) */
export async function clearCart(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("cart")
    .update({ is_cleared: true, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_cleared", false);

  if (error) throw new Error(`Failed to clear cart: ${error.message}`);
}