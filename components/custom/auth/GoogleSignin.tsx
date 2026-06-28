"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "./Googleicon";
import { createClient } from "@/lib/supabase/client";

export default function GoogleSignin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
      console.log("🔍 redirectTo being sent to Supabase:", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google SignIn Error:", error);
      alert("Failed to start Google Sign In: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 gap-2.5"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
      Continue with Google
    </Button>
  );
}
