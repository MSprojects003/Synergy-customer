// components/custom/reservations/ReservationList.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import {
  fetchReservationsByCustomer,
  ReservationStatus,
} from '@/lib/api/servicereservation';
import ReservationCard from './ResrevationCard';

type FilterOption = "all" | ReservationStatus;

export default function ReservationList() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  // Get current user from Supabase Auth
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCustomerId(user.id);
      }
    };

    getUser();
  }, []);

  const {
    data: reservations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservations", customerId],
    queryFn: () => fetchReservationsByCustomer(customerId!),
    enabled: !!customerId,
  });

  const counts = useMemo(() => {
    const base: Record<FilterOption, number> = {
      all: reservations?.length ?? 0,
      pending: 0,
      accepted: 0,
      cancelled: 0,
    };

    reservations?.forEach((r) => {
      if (r.status in base) {
        base[r.status as ReservationStatus] += 1;
      }
    });

    return base;
  }, [reservations]);

  const filtered = useMemo(() => {
    if (!reservations) return [];
    if (activeFilter === "all") return reservations;
    return reservations.filter((r) => r.status === activeFilter);
  }, [reservations, activeFilter]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header with Title and Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and track all your service bookings in one place.
          </p>
        </div>

        {/* Filter Dropdown - Top Right */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
            Filter:
          </label>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as FilterOption)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Reservations ({counts.all})</option>
            <option value="pending">Pending ({counts.pending})</option>
            <option value="accepted">Accepted ({counts.accepted})</option>
            <option value="cancelled">Cancelled ({counts.cancelled})</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Something went wrong while loading your reservations. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-base font-medium text-gray-700">
            {activeFilter === "all"
              ? "No reservations yet"
              : `No ${activeFilter} reservations`}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Bookings you make will show up here.
          </p>
        </div>
      )}

      {/* Reservations List */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="space-y-4">
         {filtered.map((reservation) => (
  <ReservationCard key={reservation.id} reservation={reservation} />
))}
        </div>
      )}
    </div>
  );
}