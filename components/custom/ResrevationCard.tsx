// components/custom/reservations/ReservationCard.tsx
"use client";

import { useState } from "react";
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { ServiceReservationWithDetails } from "@/lib/api/servicereservation";
import ServiceReservationDetails from "@/components/custom/reservation/ServiceReservationDetials";

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  pending: { label: "Pending", dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" },
  accepted: { label: "Accepted", dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function ReservationCard({ reservation }: { reservation: ServiceReservationWithDetails }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const cfg = statusConfig[reservation.status];
  const service = reservation.service;
  const serviceName = service?.name || "Service Reservation";
  const serviceImage = service?.image_url;

  const hasVendorTime = reservation.vendor_start_time && reservation.vendor_end_time;

  return (
    <>
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        className="w-full text-left rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all relative group"
      >
        <div className="flex gap-5">
          {/* Service Image */}
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
            {serviceImage ? (
              <Image
                src={serviceImage}
                alt={serviceName}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-3xl">🛠️</div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-base text-gray-900">{serviceName}</p>
                <p className="text-xs text-gray-500">Reservation #{reservation.id.slice(-8).toUpperCase()}</p>
              </div>

              {/* Status */}
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </div>
            </div>

            {/* Requested Date */}
            <div className="mt-4">
              <p className="text-[11px] text-gray-500">Requested Date</p>
              <p className="text-xs font-medium text-gray-800">{formatDate(reservation.reservation_date)}</p>
            </div>

            {/* Requested Time */}
            <div className="mt-2.5">
              <p className="text-[11px] text-gray-500">Requested Time</p>
              <p className="text-xs font-medium text-gray-800">
                {formatTime(reservation.start_time)} — {formatTime(reservation.end_time)}
              </p>
            </div>

            <p className="mt-3 text-[11px] text-gray-400">
              Booked on {new Date(reservation.created_at).toLocaleString()}
            </p>
          </div>

          {/* Right Side - Total + Confirmed Service Time */}
          <div className="flex flex-col items-end justify-between text-right pr-6">
            <div>
              <p className="text-[11px] text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">LKR {reservation.total_amount.toLocaleString()}</p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <p className="text-[11px] font-medium bg-gray-100 px-2.5 py-1 rounded-md">Cash on Delivery</p>

              <div className="text-right">
                <p
                  className={`text-[11px] font-medium mb-1 ${
                    hasVendorTime ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  Confirmed Service Time
                </p>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-lg font-medium ${
                      hasVendorTime
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {hasVendorTime ? formatTime(reservation.vendor_start_time!) : "__:__"}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span
                    className={`px-2 py-0.5 rounded-lg font-medium ${
                      hasVendorTime
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {hasVendorTime ? formatTime(reservation.vendor_end_time!) : "__:__"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chevron to open details */}
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Details Sheet */}
      <ServiceReservationDetails
        reservation={reservation}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}