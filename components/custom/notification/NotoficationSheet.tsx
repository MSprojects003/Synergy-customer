// components/custom/notifications/NotificationSheet.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import {
  fetchNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "@/lib/api/notification";
import NotificationCard from "./NotificationCard";

type Filter = "all" | "unread";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

export default function NotificationSheet({ open, onOpenChange, userId }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotificationsByUserId(userId),
    enabled: open && !!userId,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const { mutate: markOneRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (id: string) => {
      // Optimistically update
      queryClient.setQueryData(
        ["notifications", userId],
        (old: Notification[] = []) =>
          old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    },
  });

  const { mutate: markAllRead, isPending: markingAll } = useMutation({
    mutationFn: () => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications", userId],
        (old: Notification[] = []) => old.map((n) => ({ ...n, is_read: true }))
      );
    },
  });

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[420px] flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </SheetTitle>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                disabled={markingAll}
                className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
            {(["all", "unread"] as Filter[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  filter === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "unread" && unreadCount > 0
                  ? `Unread (${unreadCount})`
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {filter === "unread" ? "All caught up!" : "No notifications yet"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === "unread"
                  ? "You have no unread notifications."
                  : "Notifications will appear here."}
              </p>
            </div>
          )}

          {/* Cards */}
          {!isLoading &&
            filtered.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={(id) => markOneRead(id)}
              />
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}