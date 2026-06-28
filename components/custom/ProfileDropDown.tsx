"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Package, Calendar, Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileDropDown = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const menuItems = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "My Orders", href: "/orders", icon: Package },
    { name: "Work Reservations", href: "/reservations", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* ==================== DESKTOP DROPDOWN ==================== */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
            >
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-semibold">John Doe</span>
              <span className="text-sm text-gray-500">john@example.com</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {menuItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href} className="flex items-center gap-3 cursor-pointer py-2.5">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer py-2.5">
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ==================== MOBILE PROFESSIONAL SHEET ==================== */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100"
          onClick={() => setIsSheetOpen(true)}
        >
          <User className="h-6 w-6" />
        </Button>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-[85%] max-w-[380px] sm:w-96 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b px-6 py-5 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <SheetTitle className="text-xl font-semibold">My Account</SheetTitle>
                 </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>

              {/* User Info */}
              <div className="px-6 py-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">John Doe</div>
                    <div className="text-sm text-gray-500">john@example.com</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 px-1 py-2 overflow-auto">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className="flex items-left gap-2 px-5 py-2 text-4 font-medium text-gray-700 hover:bg-gray-100 rounded-2xl mx-1 transition-all active:scale-[0.985]"
                    >
                      <item.icon className="h-4 w-4 text-gray-600" />
                       
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="p-6 border-t mt-auto">
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="flex w-full items-center gap-4 px-5 py-[18px] text-red-600 hover:bg-red-50 rounded-2xl transition-all text-[15px] font-medium active:scale-[0.985]"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                    <LogOut className="h-5 w-5" />
                  </div>
                  Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ProfileDropDown;