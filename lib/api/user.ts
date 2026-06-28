// lib/api/user.ts
import { supabase } from "@/lib/supabase/client";

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  profile_image: string | null;
  is_vendor: boolean;
  is_customer: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return null;
    return userData as User;
  },

  createUserFromOAuth: async (userData: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_image?: string;
  }) => {
    const { error } = await supabase.from("users").insert({
      id: userData.id,
      first_name: userData.first_name || null,
      last_name: userData.last_name || null,
      email: userData.email,
      phone: userData.phone || null,
      profile_image: userData.profile_image || null,
      is_customer: true,
      is_vendor: false,
    });

    if (error) throw error;
    return true;
  },
};