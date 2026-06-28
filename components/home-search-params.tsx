"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function HomeSearchParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      if (success === "signed_in") {
        toast.success("✅ Successfully signed in! Welcome back.");
      } else if (success === "account_created") {
        toast.success("🎉 Account created successfully! Welcome to Denuri.");
      }
    } else if (error) {
      console.error("Auth callback error code:", error);
      const message = error || `Authentication failed (${error}).`;
      toast.error("❌ " + message);
    }

    if (success || error) {
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return null;
}
