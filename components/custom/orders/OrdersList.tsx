// components/custom/orders/OrdersList.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import OrderCard from "./OrdersCard";
import { fetchUserOrders, Order } from "@/lib/api/orders";
import { useAuth } from "@/lib/auth-context";

export default function OrdersList() {
  const { user } = useAuth();

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    queryFn: () => fetchUserOrders(user!.id!),
    enabled: !!user?.id,
  });

  return (
    <div className="max-w-7xl  mx-6 px-5 py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">My orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage all your recent orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-32 bg-gray-100 rounded mb-3" />
              <div className="h-12 bg-gray-50 rounded-lg" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 border border-gray-200 rounded-2xl">
          <p className="text-sm text-gray-500">Couldn't load your orders. Try again shortly.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 rounded-2xl">
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}