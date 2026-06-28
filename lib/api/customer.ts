// lib/api/customer.ts
import { supabase } from "@/lib/supabase/client";

export interface Customer {
  id: string;
  user_id: string;
  address: string | null;
  city: string | null;
  delivery_address: any | null;
  phone: string | null;
  preferred_language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const customerApi = {
  createCustomer: async (data: {
    user_id: string;
    address?: string;
    city?: string;
    delivery_address?: any;
    phone?: string;
  }) => {
    const { error } = await supabase.from("customers").insert({
      user_id: data.user_id,
      address: data.address || null,
      city: data.city || null,
      delivery_address: data.delivery_address || null,
      phone: data.phone || null,
      preferred_language: "en",
      is_active: true,
    });

    if (error) throw error;
    return true;
  },
};