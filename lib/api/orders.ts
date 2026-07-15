// lib/api/orders.ts
import { createClient } from "@/lib/supabase/client";
import { CartItem } from "./cart";

export type OrderItemStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  status: OrderItemStatus;
  cancellationReason?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  vendorName?: string;
  items: OrderItem[];
  currency: string;
  placedDate: string;
  trackId?: string;
  estimatedDate?: string | null;
};

/** Create Orders by grouping cart items by vendor */
export async function createOrdersFromCart(
  userId: string,
  cartItems: CartItem[],
  paymentMethod: string = "cash",
  shippingAddress?: string
): Promise<{ id: string }[]> {
  const supabase = createClient();

  if (cartItems.length === 0) throw new Error("Cart is empty");

  // Group items by vendor_id
  const groupedByVendor = cartItems.reduce((acc, item) => {
    const vendorId = item.vendor_id;
    if (!acc[vendorId]) acc[vendorId] = [];
    acc[vendorId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const createdOrders: { id: string }[] = [];

  for (const [vendorId, items] of Object.entries(groupedByVendor)) {
    const totalAmount = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        vendor_id: vendorId,
        total_amount: totalAmount,
        status: "pending",
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

    // 2. Create Order Items
    const orderItemsPayload = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product?.price || 0,
      total_amount: (item.product?.price || 0) * item.quantity,
      status: "pending",
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

    createdOrders.push({ id: order.id });
  }

  // 3. Clear the cart
  const { error: clearError } = await supabase
    .from("cart")
    .update({ is_cleared: true })
    .eq("user_id", userId)
    .eq("is_cleared", false);

  if (clearError) console.warn("Failed to clear cart:", clearError.message);

  return createdOrders;
}

/** Fetch all orders for a user with items */
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      vendor:vendors (vendor_name),
      order_items (
        *,
        product:products!order_items_product_id_fkey (name, image_url)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);

  return (data || []).map((order: any) => ({
    id: order.id,
    orderNumber: order.id.slice(-8).toUpperCase(),
    vendorName: order.vendor?.vendor_name || "Unknown Vendor",
    items: (order.order_items || []).map((item: any) => ({
      id: item.id,
      name: item.product?.name || "Product",
      image: item.product?.image_url || "",
      quantity: item.quantity,
      price: item.unit_price,
      status: item.status,
      cancellationReason: item.cancellation_reason,
    })),
    currency: "LKR",
    placedDate: new Date(order.created_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    trackId: order.track_id,
    estimatedDate: null,
  }));
}