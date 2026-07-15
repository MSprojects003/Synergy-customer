// components/custom/review/AddReview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ImagePlus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { createReview, getReviewByReservationId, type Review } from "@/lib/api/serviceReviews";
import { insertNotification } from "@/lib/api/notification";

type Props = {
  reservationId: string;
  serviceId: string;
  userId: string;
  serviceName?: string;
  onSuccess?: () => void;
};

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function ReadOnlyStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-6 h-6"
          fill={star <= rating ? "#FBBF24" : "none"}
          stroke={star <= rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
      <span className="ml-2 text-xs font-medium text-amber-500">
        {ratingLabels[rating]}
      </span>
    </div>
  );
}

export default function AddReview({
  reservationId,
  serviceId,
  userId,
  serviceName,
  onSuccess,
}: Props) {
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [checkingReview, setCheckingReview] = useState(true);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Check for existing review on mount
  useEffect(() => {
    getReviewByReservationId(reservationId)
      .then((review) => setExistingReview(review))
      .catch(() => setExistingReview(null))
      .finally(() => setCheckingReview(false));
  }, [reservationId]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const combined = [...imageFiles, ...files].slice(0, 4);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  }

  function removeImage(index: number) {
    const updated = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updated);
    setImagePreviews(updated.map((f) => URL.createObjectURL(f)));
  }

  async function uploadImages(): Promise<string[]> {
    if (!imageFiles.length) return [];
    const supabase = getSupabaseClient();
    const urls: string[] = [];

    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `reviews/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("service_reviews")
        .upload(path, file, { upsert: false });

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data } = supabase.storage.from("service_reviews").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit() {
    if (rating === 0) return setError("Please select a star rating.");
    if (!message.trim()) return setError("Please write a review message.");

    setError(null);
    setLoading(true);

    try {
      const uploadedUrls = await uploadImages();

      const review = await createReview({
        reservation_id: reservationId,
        service_id: serviceId,
        user_id: userId,
        review_message: message.trim(),
        rating,
        images: uploadedUrls,
      });

      await insertNotification({
        user_id: userId,
        reference_id: reservationId,
        reference_type: "review",
        message: `Your review for "${serviceName ?? "the service"}" has been submitted successfully.`,
      });

      toast.success(`Review submitted for "${serviceName ?? "the service"}"`, {
        description: "Thank you for sharing your experience.",
      });

      setExistingReview(review);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Loading check
  if (checkingReview) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-6 w-40 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Read-only view — review already exists
  if (existingReview) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Your Review</h3>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            Submitted
          </span>
        </div>

        {/* Read-only Stars */}
        {existingReview.rating && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Rating</p>
            <ReadOnlyStars rating={existingReview.rating} />
          </div>
        )}

        {/* Read-only Review Text */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Review</p>
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed min-h-[80px]">
            {existingReview.review_message}
          </div>
        </div>

        {/* Read-only Images */}
        {existingReview.images && existingReview.images.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Photos</p>
            <div className="flex flex-wrap gap-2.5">
              {existingReview.images.map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`review-image-${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disabled submit button */}
        <Button disabled className="w-full gap-2 rounded-xl opacity-50 cursor-not-allowed">
          <Send className="w-4 h-4" />
          Review Already Submitted
        </Button>
      </div>
    );
  }

  // Form view — no review yet
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Leave a Review</h3>
        <p className="text-xs text-gray-400 mt-0.5">Share your experience with this service.</p>
      </div>

      {/* Star Rating */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Rating</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className="w-7 h-7 transition-colors"
                fill={star <= (hovered || rating) ? "#FBBF24" : "none"}
                stroke={star <= (hovered || rating) ? "#FBBF24" : "#D1D5DB"}
              />
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="ml-2 text-xs font-medium text-amber-500">
              {ratingLabels[hovered || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Review Message */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Your Review</p>
        <Textarea
          placeholder="Write your review here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] resize-none text-sm rounded-xl border-gray-200"
        />
      </div>

      {/* Image Upload */}
      <div>
        <p className="text-xs text-gray-500 mb-2">
          Photos <span className="text-gray-400">(optional, max 4)</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {imageFiles.length < 4 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px]">Add</span>
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={loading || rating === 0 || !message.trim()}
        className="w-full gap-2 rounded-xl"
      >
        <Send className="w-4 h-4" />
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}