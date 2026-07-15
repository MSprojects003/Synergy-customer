// components/custom/notifications/NotificationCard.tsx
"use client";

import { useState } from "react";
import { Bell, CalendarCheck, Star, ShoppingBag, Info } from "lucide-react";
import { type Notification } from "@/lib/api/notification";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function NotifIcon({ type }: { type: string | null }) {
  const base = "w-4 h-4";
  if (type === "review") return <Star className={`${base} text-amber-500`} />;
  if (type === "reservation") return <CalendarCheck className={`${base} text-blue-500`} />;
  if (type === "order") return <ShoppingBag className={`${base} text-emerald-500`} />;
  return <Bell className={`${base} text-gray-400`} />;
}

function iconBg(type: string | null): string {
  if (type === "review") return "bg-amber-50";
  if (type === "reservation") return "bg-blue-50";
  if (type === "order") return "bg-emerald-50";
  return "bg-gray-100";
}

const TRUNCATE_AT = 100;

type Props = {
  notification: Notification;
  onRead: (id: string) => void;
};

export default function NotificationCard({ notification, onRead }: Props) {
  const [expanded, setExpanded] = useState(false);

  const isLong = notification.message.length > TRUNCATE_AT;
  const displayMessage =
    isLong && !expanded
      ? notification.message.slice(0, TRUNCATE_AT).trimEnd() + "…"
      : notification.message;

  function handleClick() {
    if (!notification.is_read) onRead(notification.id);
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 rounded-2xl p-4 transition-colors cursor-pointer
        ${notification.is_read
          ? "bg-white border border-gray-100"
          : "bg-blue-50/60 border border-blue-100"
        }`}
    >
      {/* Unread dot */}
      {!notification.is_read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
      )}

      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg(notification.reference_type)}`}
      >
        <NotifIcon type={notification.reference_type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className={`text-sm leading-[1.6] ${notification.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
          {displayMessage}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="mt-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            {expanded ? "Show less" : "See more"}
          </button>
        )}

        <p className="mt-1.5 text-[11px] text-gray-400">
          {timeAgo(notification.created_at)}
        </p>
      </div>
    </div>
  );
}