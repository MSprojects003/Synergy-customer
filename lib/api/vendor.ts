// lib/api/vendor.ts
import { createClient } from "@/lib/supabase/client";

export type RecentVendor = {
  id: string;
  vendor_name: string | null;
  branch: string | null;
  image1: string | null;
  address: string | null;
  category: string | null;
  status: string | null;
  created_at: string;
  users: {
    profile_image: string | null;
  } | null;
};

/**
 * Fetches the 10 most recently created, active vendors, inner-joined with
 * users to pull the vendor's profile_image (used as the vendor logo).
 * Used for the "Top vendors" carousel on the Denuri home page.
 */
export async function getRecentVendors(limit = 10): Promise<RecentVendor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("vendors")
    .select(
      "id, vendor_name, branch, image1, address, category, status, created_at, users!inner(profile_image)"
    )
    
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as RecentVendor[]) ?? [];
}