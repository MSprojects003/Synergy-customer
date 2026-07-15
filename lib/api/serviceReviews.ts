// lib/api/serviceReviews.ts
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Review = {
  id: string;
  reservation_id: string;
  service_id: string;
  user_id: string;
  review_message: string;
  rating: number | null;
  images: string[];
  created_at: string;
  updated_at: string;
};

export type ReviewWithCustomer = Review & {
  customer: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  } | null;
};

export type CreateReviewInput = {
  reservation_id: string;
  service_id: string;
  user_id: string;
  review_message: string;
  rating?: number;
  images?: string[];
};

/** Create a new review */
export async function createReview(input: CreateReviewInput): Promise<Review> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_reviews")
    .insert({
      reservation_id: input.reservation_id,
      service_id: input.service_id,
      user_id: input.user_id,
      review_message: input.review_message,
      rating: input.rating ?? null,
      images: input.images ?? [],
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create review: ${error.message}`);
  return data as Review;
}

/** Get review by reservation ID */
export async function getReviewByReservationId(
  reservationId: string
): Promise<Review | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_reviews")
    .select("*")
    .eq("reservation_id", reservationId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch review: ${error.message}`);
  return data as Review | null;
}

/** Get all reviews for a service — includes customer profile */
export async function getReviewsByServiceId(
  serviceId: string
): Promise<ReviewWithCustomer[]> {
  const supabase = getSupabaseClient();

  // Step 1: fetch reviews
  const { data: reviews, error } = await supabase
    .from("service_reviews")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
  if (!reviews || reviews.length === 0) return [];

  // Step 2: fetch user details for all user_ids in one query
  const userIds = [...new Set(reviews.map((r) => r.user_id))];

  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_image")
    .in("id", userIds);

  const userMap = Object.fromEntries(
    (users ?? []).map((u) => [
      u.id,
      {
        first_name: u.first_name?.trim() ?? null,
        last_name: u.last_name?.trim() ?? null,
        profile_image: u.profile_image ?? null,
      },
    ])
  );

  return reviews.map((r) => ({
    ...r,
    customer: userMap[r.user_id] ?? null,
  })) as ReviewWithCustomer[];
}

/** Get all reviews by a user */
export async function getReviewsByUserId(userId: string): Promise<Review[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
  return (data ?? []) as Review[];
}