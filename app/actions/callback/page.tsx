"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api/user";
import { customerApi } from "@/lib/api/customer";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/?error=auth_failed");
          return;
        }

        // Split full name
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        const nameParts = fullName.trim().split(" ");
        const first_name = nameParts[0] || "";
        const last_name = nameParts.slice(1).join(" ") || "";

        // Create user record
        await userApi.createUserFromOAuth({
          id: user.id,
          email: user.email!,
          first_name,
          last_name,
          profile_image: user.user_metadata?.avatar_url,
        });

        // Create customer record
        await customerApi.createCustomer({
          user_id: user.id,
        });

        router.push("/"); // Redirect to home after success
      } catch (err) {
        console.error("Callback error:", err);
        router.push("/?error=signup_failed");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Completing your sign up...</p>
      </div>
    </div>
  );
}