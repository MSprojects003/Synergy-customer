// hooks/useServiceReservation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCashReservation,
  type CreateReservationInput,
} from "@/lib/api/servicereservation";

/**
 * Cash on delivery booking -- inserts immediately as "pending".
 * The vendor accepts/cancels later from their dashboard.
 */
export function useCreateCashReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReservationInput) => createCashReservation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}