"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, Bell, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import ProfileDropdown from "@/components/custom/ProfileDropDown";
import ServiceMenu from "@/components/custom/ServiceMenu";
import logo from "@/public/logo/logo.png";
import AuthSheet from "@/components/custom/auth/AuthSheet";
import NotificationSheet from "@/components/custom/notification/NotoficationSheet";
import { fetchNotificationsByUserId } from "@/lib/api/notification";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetchNotificationsByUserId(user!.id),
    enabled: !!user?.id,
  });
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* ==================== TOP BAR ==================== */}
      <div className="bg-blue-950 text-white py-2.5 text-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-2 text-gray-300">
              <Locate className="text-blue-400" size={18} />
              <span>Your Address Here, City, Country</span>
            </div>

            <div className="flex items-center gap-6 ml-auto md:ml-0">
              <Link href="/about" className="hover:text-gray-400 text-sm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-gray-400 text-sm transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN NAVBAR ==================== */}
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-white border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Fixoraa"
                width={140}
                height={40}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8 lg:gap-x-10">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group py-2"
              >
                Home
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>

              <ServiceMenu />

              <Link
                href="/products"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group py-2"
              >
                Products
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>

              <Link
                href="/orders"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group py-2"
              >
                My Orders
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>

              <Link
                href="/reservations"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group py-2"
              >
                Work Reservations
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-x-3">
              <Link     className="rounded-full hover:bg-gray-100" href="/checkout">
                <ShoppingCart className="h-4 w-4" />
              </Link>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  onClick={() => setNotifOpen(true)}
                >
                  <Bell className="h-5 w-5" />
                </Button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center px-1 pointer-events-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>

              {isAuthenticated ? <ProfileDropdown /> : <AuthSheet />}
            </div>

            {/* ==================== MOBILE RIGHT SIDE ==================== */}
            <div className="md:hidden flex items-center gap-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(true)}
                >
                  <Bell className="h-6 w-6" />
                </Button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center px-1 pointer-events-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>

              {isAuthenticated && <ProfileDropdown />}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ==================== MOBILE MENU ==================== */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-white z-[60] transition-all duration-300 overflow-hidden",
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
                <Image src={logo} alt="Fixoraa" width={140} height={40} className="h-9 w-auto" priority />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-3 rounded-xl hover:bg-gray-100">
                <X className="h-7 w-7" />
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-[17px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                Home
              </Link>
              <Link href="/services" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-[17px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                Services
              </Link>
              <Link href="/products" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-[17px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                Products
              </Link>
              <Link href="/orders" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-[17px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                My Orders
              </Link>
              <Link href="/reservations" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-[17px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                Work Reservations
              </Link>
            </nav>

            <div className="p-6 border-t border-gray-100 mt-auto space-y-4">
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 py-6 rounded-2xl" onClick={() => setIsOpen(false)}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Cart
                </Button>
              </div>

              {!isAuthenticated && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 py-6 rounded-2xl" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Button>
                  <Button className="flex-1 py-6 rounded-2xl bg-blue-950 hover:bg-blue-900" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== NOTIFICATION SHEET ==================== */}
      {isAuthenticated && user?.id && (
        <NotificationSheet
          open={notifOpen}
          onOpenChange={setNotifOpen}
          userId={user.id}
        />
      )}
    </>
  );
};

export default Navbar;