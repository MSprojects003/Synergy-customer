"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Signin from "./Signin";

export default function AuthSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitchToSignup = () => setIsSignup(true);
  const handleSwitchToSignin = () => setIsSignup(false);

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => {
          setIsSignup(false); // Reset to signin when opening
          setIsOpen(true);
        }}
        className="bg-blue-950 hover:bg-blue-900 text-white rounded-full px-6 font-medium"
      >
        Sign In
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="px-6 pt-6 pb-4 text-left border-b">
            <SheetTitle className="text-2xl font-semibold">
              {isSignup ? "Create your account" : "Welcome to Denuri"}
            </SheetTitle>
            <p className="text-sm text-gray-500 mt-1">
              {isSignup
                ? "Get started — it only takes a minute."
                : "Sign in to access your account"}
            </p>
          </SheetHeader>

          <div className="overflow-auto h-[calc(100vh-120px)]">
            <Signin
              isSignup={isSignup}
              onSwitchToSignup={handleSwitchToSignup}
              onSwitchToSignin={handleSwitchToSignin}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}