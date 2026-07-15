// components/custom/review/ReviewCard.tsx
import { Star } from "lucide-react";
import { type ReviewWithCustomer } from "@/lib/api/serviceReviews";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function ReviewCard({ review }: { review: ReviewWithCustomer }) {
  const customer = review.customer;
  const fullName = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || "Customer";
  const avatarUrl = customer?.profile_image ?? null;
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-none  border-sm border-1  p-4 space-y-3 shadow-none">
      {/* Top row: avatar + name + rating badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-600">{initial}</span>
            )}
          </div>

          {/* Name */}
          <p className="text-lg font-bold text-gray-900">{fullName}</p>
        </div>

        {/* Star rating badge */}
        {review.rating != null && (
          <div className="flex items-center gap-1.5 border border-amber-400 rounded-full px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-semibold text-amber-500">{review.rating}</span>
          </div>
        )}
      </div>

      {/* Review message */}
      <p className="text-sm text-gray-700 font-light leading-relaxed">{review.review_message}</p>

      {/* Review images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.images.map((url, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`review-photo-${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-gray-400">{timeAgo(review.created_at)}</p>
    </div>
  );
}