// components/custom/reservations/ServiceReservationDetails.tsx
"use client";

import { type ElementType, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Banknote,
  CalendarDays,
  Clock,
  ReceiptText,
  Timer,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ServiceReservationWithDetails } from "@/lib/api/servicereservation";
import AddReview from "../review/AddReview";

interface ServiceReservationDetailsProps {
  reservation: ServiceReservationWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function Row({
  icon: Icon,
  label,
  value,
  valueClassName = "text-gray-800",
}: {
  icon: ElementType;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        {label}
      </span>
      <span className={`text-sm font-medium text-right ${valueClassName}`}>{value}</span>
    </div>
  );
}

export default function ServiceReservationDetails({
  reservation,
  open,
  onOpenChange,
}: ServiceReservationDetailsProps) {
  if (!reservation) return null;

  const service = reservation.service;
  const serviceName = service?.name ?? "Service";
  const serviceImage = service?.image_url;
  const hasVendorTime = reservation.vendor_start_time && reservation.vendor_end_time;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Reservation Details</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Service Information */}
          <div className="flex gap-5">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200">
              {serviceImage ? (
                <Image
                  src={serviceImage}
                  alt={serviceName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-4xl">🛠️</div>
              )}
            </div>

            <div className="flex-1 pt-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 leading-tight truncate">
                {serviceName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Reservation #{reservation.id.slice(-8).toUpperCase()}
              </p>
              {service?.description && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-2xl px-5">
            <Row
              icon={CalendarDays}
              label="Requested Date"
              value={formatDate(reservation.reservation_date)}
            />
            <Row
              icon={Clock}
              label="Requested Time"
              value={`${formatTime(reservation.start_time)} — ${formatTime(reservation.end_time)}`}
            />
            <Row
              icon={Timer}
              label="Confirmed Service Time"
              value={
                hasVendorTime
                  ? `${formatTime(reservation.vendor_start_time!)} — ${formatTime(reservation.vendor_end_time!)}`
                  : "__:__ — __:__"
              }
              valueClassName={hasVendorTime ? "text-emerald-700" : "text-gray-400"}
            />
            <Row
              icon={Users}
              label="People"
              value={`${reservation.people_count} ${reservation.people_count === 1 ? "person" : "people"}`}
            />
            <Row
              icon={ReceiptText}
              label="Payment Method"
              value="Cash on Delivery"
            />
            <Row
              icon={Banknote}
              label="Total Amount"
              value={`LKR ${reservation.total_amount.toLocaleString()}`}
              valueClassName="text-gray-900 font-semibold text-base"
            />
            <Row
              icon={Clock}
              label="Booked On"
              value={new Date(reservation.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              valueClassName="text-gray-500"
            />
          </div>

          {/* Add Review - only show for accepted reservations */}
          {reservation.status === "accepted" && (
            <AddReview
              reservationId={reservation.id}
              serviceId={reservation.service_id}
              userId={reservation.customer_id}
              serviceName={serviceName}
              onSuccess={() => onOpenChange(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}