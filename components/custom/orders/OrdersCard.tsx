// components/custom/orders/OrderCard.tsx
import Image from 'next/image';
import { Order, OrderItem, OrderItemStatus } from '@/lib/api/orders';

const statusConfig: Record<OrderItemStatus, { label: string; dot: string; text: string }> = {
  pending:    { label: "Pending",    dot: "bg-amber-500",   text: "text-amber-700" },
  confirmed:  { label: "Confirmed",  dot: "bg-blue-500",    text: "text-blue-700" },
  processing: { label: "Processing", dot: "bg-violet-500",  text: "text-violet-700" },
  shipped:    { label: "Shipped",    dot: "bg-indigo-500",  text: "text-indigo-700" },
  delivered:  { label: "Delivered",  dot: "bg-emerald-500", text: "text-emerald-700" },
  cancelled:  { label: "Cancelled",  dot: "bg-red-500",     text: "text-red-700" },
};

function StatusPill({ status }: { status: OrderItemStatus }) {
  const config = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </span>
  );
}

export default function OrderCard({ order }: { order: Order }) {
  const activeItems = order.items.filter((i: OrderItem) => i.status !== "cancelled");
  const allCancelled = activeItems.length === 0;
  const computedTotal = activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-300">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-gray-900 tracking-tight">
            Order #{order.orderNumber}
          </p>
          <p className="text-xs text-gray-500">
            {order.vendorName ? `${order.vendorName} · ` : ""}
            Placed {order.placedDate}
          </p>
        </div>

        <div className="text-right">
          <p className={`text-base font-semibold ${allCancelled ? "text-gray-400" : "text-gray-900"}`}>
            {order.currency} {computedTotal.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <div key={item.id} className="px-5 py-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty {item.quantity} · {order.currency} {item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                
                <StatusPill status={item.status} />
              </div>
            </div>

            {item.status === "cancelled" && item.cancellationReason && (
              <div className="mt-2.5 ml-[62px] px-3 py-2 rounded-lg bg-red-50 text-xs text-red-600">
                <span className="font-medium">Cancelled:</span> {item.cancellationReason}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {(order.trackId || order.estimatedDate) && !allCancelled && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
          {order.trackId && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Track ID</span>
              <span className="font-mono font-medium text-gray-700">{order.trackId}</span>
            </div>
          )}

          {order.estimatedDate && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Est. delivery</span>
              <span className="font-medium text-gray-700">{order.estimatedDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}