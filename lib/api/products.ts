// lib/api/products.ts
import { createClient } from "@/lib/supabase/client";

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  image_url_2?: string | null;
  category?: string | null;
  rating: number;
  stock?: number;
  is_active: boolean;
  brand?: string | null;
  sku?: string | null;
  colors?: string[] | null;
  weight?: number | null;
  weight_unit?: string | null;
  dimensions?: string | null;
  quantity?: number | null;
  is_available?: boolean | null;
  status?: string | null;
  created_at: string;
  vendor?: {
    id: string;
    vendor_name: string | null;
    image1: string | null;
    address: string | null;
    branch: string | null;
  } | null;
}

export const productsApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return (data || []).map((product: any) => ({
      ...product,
      rating: product.rating || 4.5,
    }));
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        vendor:vendors (
          id,
          vendor_name,
          image1,
          address,
          branch
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      rating: data.rating || 4.5,
    };
  },
};