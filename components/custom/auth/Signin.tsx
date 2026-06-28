"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "./Googleicon";
import Signup from "./Signup";

interface SigninProps {
  isSignup: boolean;
  onSwitchToSignup: () => void;
  onSwitchToSignin: () => void;
}

export default function Signin({
  isSignup,
  onSwitchToSignup,
  onSwitchToSignin,
}: SigninProps) {
  const [showPassword, setShowPassword] = useState(false);

  // If signup mode is active, render Signup component
  if (isSignup) {
    return <Signup onSwitchToSignin={onSwitchToSignin} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 px-6 py-8">
      

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-0 h-11 gap-2.5 border-gray-200 hover:bg-gray-50 font-medium text-gray-700"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400 uppercase tracking-wide">
            or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            className="h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 font-medium gap-1.5"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}