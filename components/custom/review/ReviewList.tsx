// components/custom/review/ReviewList.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getReviewsByServiceId } from "@/lib/api/serviceReviews";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ serviceId }: { serviceId: string }) {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ["reviews", serviceId],
    queryFn: () => getReviewsByServiceId(serviceId),
    enabled: !!serviceId,
  });

  const rated = reviews?.filter((r) => r.rating != null) ?? [];
  const avgRating =
    rated.length > 0
      ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
      : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reviews
          {reviews && reviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({reviews.length})
            </span>
          )}
        </h2>

        {avgRating != null && (
          <div className="flex items-center gap-1.5 border border-amber-400 rounded-full px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-semibold text-amber-500">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">/ 5</span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-500">Failed to load reviews.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && (!reviews || reviews.length === 0) && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
          <p className="text-sm font-medium text-gray-500">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to leave a review.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && reviews && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}