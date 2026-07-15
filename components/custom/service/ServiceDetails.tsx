// components/ServiceDetails.tsx
"use client";

import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Clock,
  Users,
  Timer,
} from "lucide-react";
import { useServiceById } from "@/hooks/UseServices";
import ReviewList from "../review/ReviewList";

const subscriptionStyles: Record<string, string> = {
  basic: "bg-gray-100 text-gray-600",
  pro: "bg-violet-50 text-violet-700",
  premium: "bg-amber-50 text-amber-700",
};

function durationText(min: number | null, unit: string | null) {
  if (!min || !unit) return null;
  const label = min === 1 ? unit.replace(/s$/, "") : unit;
  return `Takes about ${min} ${label}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  );
}

export default function ServiceDetails({ id }: { id: string }) {
  const { data: service, isLoading, isError, error } = useServiceById(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-72 sm:h-96 rounded-3xl bg-gray-100 animate-pulse" />
        <div className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
        <div className="h-28 rounded-3xl bg-gray-100 animate-pulse" />
        <div className="h-24 rounded-3xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "This service couldn't be found."}
        </p>
      </div>
    );
  }

  const { vendor } = service;
  const duration = durationText(service.min_duration, service.duration_unit);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Hero image ───────────────────────────────────────── */}
      <div className="relative h-72 sm:h-[420px] rounded-3xl overflow-hidden bg-gray-100">
        {service.image_url && (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            priority
            className="object-cover"
          />
        )}
        {/* Category eyebrow + availability pinned to bottom-left of hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
            {service.category}
          </span>
          {service.is_available ? (
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-900/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-500/30">
              Available
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* ── Service info ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-snug tracking-tight">
          {service.name}
        </h1>

        {service.description && (
          <p className="mt-3 text-sm text-gray-500 leading-[1.75]">
            {service.description}
          </p>
        )}

        {/* Fact pills */}
        {(duration || service.max_capacity != null || (service.has_preparation_time && service.preparation_time > 0)) && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
            {duration && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {duration}
              </span>
            )}
            {service.max_capacity != null && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                Up to {service.max_capacity} {service.max_capacity === 1 ? "person" : "people"}
              </span>
            )}
            {service.has_preparation_time && service.preparation_time > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <Timer className="w-3.5 h-3.5 text-gray-400" />
                {service.preparation_time} min prep time
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Vendor card ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <SectionLabel>Provider</SectionLabel>

        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-100">
            {vendor?.image1 ? (
              <Image
                src={vendor.image1}
                alt={vendor.vendor_name ?? "Vendor"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {vendor?.vendor_name?.charAt(0) ?? "?"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {vendor?.vendor_name ?? "Unknown vendor"}
            </p>
            {(vendor?.address || vendor?.branch) && (
              <p className="mt-0.5 text-xs text-gray-400 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                {vendor.address || vendor.branch}
              </p>
            )}
          </div>
        </div>

        {/* Trust badges */}
        {(vendor?.nic_verified || vendor?.vo_verified || (vendor?.has_subscription && vendor.subscription_type !== "basic")) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {vendor?.nic_verified && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                ID verified
              </span>
            )}
            {vendor?.vo_verified && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                Business verified
              </span>
            )}
            {vendor?.has_subscription && vendor.subscription_type !== "basic" && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${subscriptionStyles[vendor.subscription_type]}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {vendor.subscription_type === "premium" ? "Premium vendor" : "Pro vendor"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Booking policy ───────────────────────────────────── */}
      {service.policies && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <SectionLabel>Booking Policy</SectionLabel>
          <p className="text-sm text-gray-500 leading-[1.75]">
            {service.policies}
          </p>
        </div>
      )}

      {/* ── Reviews ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <ReviewList serviceId={id} />
      </div>
    </div>
  );
}