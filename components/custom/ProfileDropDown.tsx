"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Calendar, Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
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
import ProfileSheet from "./profile/ProfileSheet";

const ProfileDropDown = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    setIsSheetOpen(false);
    router.push("/");
  };

  const menuItems = [
    { name: "My Orders", href: "/orders", icon: Package },
    { name: "Work Reservations", href: "/reservations", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (!isAuthenticated || !user) return null;

  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email?.split("@")[0];

  const avatarLetter =
    user.first_name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    "?";

  const profileImage = user.profile_image ?? null;

  function AvatarTrigger({ size = "sm" }: { size?: "sm" | "lg" }) {
    const dim = size === "lg" ? "w-14 h-14 text-xl rounded-2xl" : "w-9 h-9 text-sm rounded-full";
    return profileImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profileImage}
        alt={displayName}
        className={`${dim} object-cover bg-gray-100`}
      />
    ) : (
      <div className={`${dim} bg-blue-100 text-blue-700 font-semibold flex items-center justify-center`}>
        {avatarLetter}
      </div>
    );
  }

  return (
    <>
      {/* ==================== DESKTOP DROPDOWN ==================== */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full p-0 overflow-hidden hover:ring-2 hover:ring-blue-200 transition-all w-9 h-9"
            >
              <AvatarTrigger size="sm" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-semibold">{displayName}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* My Profile opens ProfileSheet */}
            <DropdownMenuItem
              className="flex items-center gap-3 cursor-pointer py-2.5"
              onClick={() => setProfileSheetOpen(true)}
            >
              <User className="h-4 w-4" />
              My Profile
            </DropdownMenuItem>

            {menuItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href} className="flex items-center gap-3 cursor-pointer py-2.5">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 cursor-pointer py-2.5"
            >
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
          className="rounded-full p-0 overflow-hidden hover:ring-2 hover:ring-blue-200 transition-all w-9 h-9"
          onClick={() => setIsSheetOpen(true)}
        >
          <AvatarTrigger size="sm" />
        </Button>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-[85%] max-w-[380px] sm:w-96 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b px-6 py-5 flex items-center justify-between bg-white sticky top-0 z-10">
                <SheetTitle className="text-xl font-semibold">My Account</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>

              {/* User Info */}
              <div className="px-6 py-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                  <AvatarTrigger size="lg" />
                  <div>
                    <div className="font-semibold text-lg">{displayName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 px-1 py-2 overflow-auto">
                <div className="space-y-1">
                  {/* My Profile opens ProfileSheet */}
                  <button
                    type="button"
                    onClick={() => { setIsSheetOpen(false); setTimeout(() => setProfileSheetOpen(true), 200); }}
                    className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-2xl mx-1 transition-all active:scale-[0.985]"
                  >
                    <User className="h-4 w-4 text-gray-600" />
                    My Profile
                  </button>

                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-2xl mx-1 transition-all active:scale-[0.985]"
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
                  onClick={handleLogout}
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

      {/* ==================== PROFILE SHEET ==================== */}
      <ProfileSheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </>
  );
};

export default ProfileDropDown;