"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import Signin from "./Signin";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left panel — Brand */}
      <div className="hidden lg:flex lg:w-[44%] relative bg-gray-950 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Denuri
          </span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
            Everything you need,
            <br />
            built to last.
          </h2>
          <p className="mt-4 text-gray-400 text-[15px] leading-relaxed">
            Power tools, hardware, and supplies from brands tradespeople
            actually trust. Stocked, fast, and ready when the job is.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-gray-500 text-xs">
          <span>© {new Date().getFullYear()} Denuri</span>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Terms
          </a>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">
              Denuri
            </span>
          </div>

          <Signin
            isSignup={isSignup}
            onSwitchToSignup={() => setIsSignup(true)}
            onSwitchToSignin={() => setIsSignup(false)}
          />
        </div>
      </div>
    </div>
  );
}
