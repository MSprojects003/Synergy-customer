/*lib/api/service.ts*/// lib/api/service.ts
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Shape returned by Supabase once `vendors` is joined in via the FK.
export type ServiceWithVendor = {
  id: string;
  vendor_id: string;
  name: string;
  category: string;
  description: string | null;
  price_type: "fixed" | "hourly";
  price: number;
  min_duration: number | null;
  duration_unit: "minutes" | "hours" | "days" | "weeks" | null;
  is_available: boolean;
  has_preparation_time: boolean;
  preparation_time: number;
  max_capacity: number | null;
  policies: string | null;
  image_url: string | null;
  status: "active" | "inactive" | "deleted";
  created_at: string;
  updated_at: string;
  vendor: {
    id: string;
    vendor_name: string | null;
    branch: string | null;
    address: string | null;
    image1: string | null;
    category: string | null;
    nic_verified: boolean;
    vo_verified: boolean;
    status: "pending" | "active" | "deleted";
    has_subscription: boolean;
    subscription_type: "basic" | "pro" | "premium";
  };
};

const SERVICE_WITH_VENDOR_SELECT = `
  id,
  vendor_id,
  name,
  category,
  description,
  price_type,
  price,
  min_duration,
  duration_unit,
  is_available,
  has_preparation_time,
  preparation_time,
  max_capacity,
  policies,
  image_url,
  status,
  created_at,
  updated_at,
  vendor:vendors (
    id,
    vendor_name,
    branch,
    address,
    image1,
    category,
    nic_verified,
    vo_verified,
    status,
    has_subscription,
    subscription_type
  )
`;

/**
 * Fetch all active services for a given category (e.g. "salon", "electrician"),
 * each with its vendor's details joined in.
 */
export async function fetchServicesByCategory(
  category: string
): Promise<ServiceWithVendor[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_WITH_VENDOR_SELECT)
    .eq("category", category)
    .eq("status", "active")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch services for "${category}": ${error.message}`);
  }

  return (data ?? []) as unknown as ServiceWithVendor[];
}

/**
 * Fetch a single service by id, with its vendor's details joined in.
 * Used by the service detail / booking page.
 */
export async function fetchServiceById(
  id: string
): Promise<ServiceWithVendor | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_WITH_VENDOR_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no row found
    throw new Error(`Failed to fetch service "${id}": ${error.message}`);
  }

  return data as unknown as ServiceWithVendor;
}