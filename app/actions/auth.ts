"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signupCustomer(formData: FormData) {
  const supabase = await createClient();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const delivery_address = JSON.parse(formData.get("delivery_address") as string || "{}");
  const password = formData.get("password") as string;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name, last_name } },
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error("Failed to create user");

    await supabase.from("users").insert({
      id: userId,
      first_name,
      last_name,
      email,
      phone,
      is_customer: true,
    });

    await supabase.from("customers").insert({
      user_id: userId,
      address,
      city,
      delivery_address,
      phone,
    });

    revalidatePath("/");
    return { success: true, userId };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { success: false, error: error.message };
  }
}
