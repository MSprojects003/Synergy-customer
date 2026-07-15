// components/ServiceBooking.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Banknote, Loader2 } from "lucide-react";
import { useServiceById } from "@/hooks/UseServices";
import { useCreateCashReservation } from "@/hooks/useServiceReservation";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createBrowserClient } from "@supabase/ssr";

function priceUnitLabel(priceType: "fixed" | "hourly") {
  return priceType === "hourly" ? "/ hour" : "fixed price";
}

export default function ServiceBooking({ id }: { id: string }) {
  const { data: service, isLoading, isError } = useServiceById(id);
  const createReservation = useCreateCashReservation();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("16:00");

  const [isMultiplePeople, setIsMultiplePeople] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Get logged-in user
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCustomerId(user.id);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="w-72 bg-white rounded-2xl border border-gray-100 p-4 lg:fixed lg:top-26 lg:right-10 shadow-sm">
        <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-8 w-full bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-8 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !service) return null;

  const qty = isMultiplePeople ? peopleCount : 1;
  const total = service.price_type === "fixed" ? service.price * qty : service.price;

  function handleConfirmBooking() {
    setBookingError(null);

    if (!customerId) {
      setBookingError("Please log in to make a booking.");
      return;
    }

    if (!selectedDate) {
      setBookingError("Pick a date for your booking.");
      return;
    }

    createReservation.mutate(
      {
        service_id: id,
        vendor_id: service?.vendor_id as string,
        customer_id: customerId,
        reservation_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        people_count: qty,
        total_amount: total,
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          // Optional: show success message
          alert("Booking request sent successfully!");
        },
        onError: (err) => {
          setBookingError(
            err instanceof Error ? err.message : "Couldn't place your booking. Try again."
          );
        },
      }
    );
  }

  return (
    <>
      <div className="w-72 bg-white rounded-2xl border border-gray-100 p-4 lg:fixed lg:top-26 lg:right-10 shadow-sm text-sm">
        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-gray-900">
            Rs. {service.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">{priceUnitLabel(service.price_type)}</span>
        </div>

        {/* Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="text-xs font-medium text-gray-900 flex items-center gap-1 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Preferred time window */}
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-900 flex items-center gap-1 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Preferred time window
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Start</p>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">End</p>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">
            Vendor completes the service any time in this window.
          </p>
        </div>

        {/* Multiple people switch */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              Booking for multiple people
            </label>
            <Switch
              checked={isMultiplePeople}
              onCheckedChange={setIsMultiplePeople}
              aria-label="Toggle multiple people booking"
            />
          </div>

          {isMultiplePeople && (
            <div className="mt-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Number of people</p>
              <input
                type="number"
                min={2}
                value={peopleCount}
                onChange={(e) =>
                  setPeopleCount(Math.max(2, Number(e.target.value) || 2))
                }
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="text-xs font-medium text-gray-900 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Service address
          </label>
          <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-2 leading-snug">
            24 Horton Place, Colombo 07
          </p>
        </div>

        {/* Total + CTA */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {isMultiplePeople && (
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-gray-900">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={!service.is_available || !customerId}
            onClick={() => setConfirmOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-xl transition-colors text-xs"
          >
            {service.is_available ? "Review and request booking" : "Unavailable right now"}
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Cash on delivery -- pay when the service is done
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm your booking</DialogTitle>
            <DialogDescription>
              This booking is cash on delivery — you pay the vendor directly once the service is done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 border border-gray-200 rounded-xl py-4 px-4 my-1">
            <Banknote className="w-5 h-5 text-gray-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Cash on delivery</p>
              <p className="text-xs text-gray-500">
                Rs. {total.toLocaleString()} due {service.price_type === "hourly" ? "per hour" : "total"}
              </p>
            </div>
          </div>

          {bookingError && (
            <p className="text-xs text-red-500 text-center">{bookingError}</p>
          )}

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={createReservation.isPending || !customerId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {createReservation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {createReservation.isPending ? "Placing your booking…" : "Confirm booking"}
          </button>

          <DialogFooter className="sm:justify-center">
            <p className="text-[11px] text-gray-400">
              The vendor will confirm or decline this request.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}