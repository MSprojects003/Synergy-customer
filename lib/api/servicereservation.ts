// lib/api/serviceReservation.ts
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type ReservationStatus = "pending" | "accepted" | "cancelled";
export type PaymentMethod = "cash";

export type ServiceReservationWithDetails = {
  id: string;
  service_id: string;
  vendor_id: string;
  customer_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  vendor_start_time: string | null;     // ← New
  vendor_end_time: string | null;       // ← New
  people_count: number;
  status: ReservationStatus;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  total_amount: number;
  cancellation_reason: string | null;   // ← New
  created_at: string;
  updated_at: string;

  service: {
    id: string;
    name: string;
    category: string;
    description: string | null;
    price: number;
    price_type: string;
    image_url: string | null;
    is_available: boolean;
  } | null;
};

export type CreateReservationInput = {
  service_id: string;
  vendor_id: string;
  customer_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  people_count: number;
  total_amount: number;
};

/** Create Reservation */
export async function createCashReservation(
  input: CreateReservationInput
): Promise<any> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_reservations")
    .insert({
      ...input,
      status: "pending",
      payment_method: "cash",
      payment_reference: null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create reservation: ${error.message}`);
  return data;
}

/** Fetch Reservations WITH Service Details */
export async function fetchReservationsByCustomer(
  customerId: string
): Promise<ServiceReservationWithDetails[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_reservations")
    .select(`
      *,
      service:services (
        name,
        image_url
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reservations: ${error.message}`);
  }

  return (data ?? []) as ServiceReservationWithDetails[];
}