// lib/hooks/useServices.ts
import { useQuery } from "@tanstack/react-query";
import { fetchServicesByCategory, fetchServiceById } from "@/lib/api/service";

export function useServicesByCategory(category: string) {
  return useQuery({
    queryKey: ["services", "category", category],
    queryFn: () => fetchServicesByCategory(category),
    enabled: !!category,
    staleTime: 60 * 1000,
  });
}

export function useServiceById(id: string) {
  return useQuery({
    queryKey: ["services", "detail", id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}