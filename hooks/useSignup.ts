import { useMutation } from "@tanstack/react-query";
import { signupCustomer } from "@/app/actions/auth";

export function useSignup() {
  return useMutation({
    mutationFn: signupCustomer,
    onSuccess: (data) => {
      if (data.success) {
        console.log("Signup successful!", data.userId);
        // You can add toast notification here
      }
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
    },
  });
}