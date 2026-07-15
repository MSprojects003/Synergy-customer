// lib/api/notification.ts
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Notification = {
  id: string;
  user_id: string;
  reference_id: string | null;
  reference_type: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type CreateNotificationInput = {
  user_id: string;
  reference_id?: string;
  reference_type?: string;
  message: string;
};

/** Insert a notification. reference_id should be the service_reservation_id. */
export async function insertNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.user_id,
      reference_id: input.reference_id ?? null,
      reference_type: input.reference_type ?? null,
      message: input.message,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to insert notification: ${error.message}`);
  return data as Notification;
}

/** Fetch all notifications for a user, newest first */
export async function fetchNotificationsByUserId(
  userId: string
): Promise<Notification[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch notifications: ${error.message}`);
  return (data ?? []) as Notification[];
}

/** Mark a single notification as read */
export async function markNotificationAsRead(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw new Error(`Failed to mark notification as read: ${error.message}`);
}

/** Mark all notifications as read for a user */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw new Error(`Failed to mark all as read: ${error.message}`);
}