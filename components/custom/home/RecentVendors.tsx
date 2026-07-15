// components/custom/vendors/RecentVendors.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ChevronLeft, ChevronRight, Store } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getRecentVendors, type RecentVendor } from "@/lib/api/vendor";

export default function RecentVendors() {
  const [api, setApi] = React.useState<CarouselApi>();

  const {
    data: vendors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vendors", "recent"],
    queryFn: () => getRecentVendors(10),
    staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    return null;
  }

  if (!isLoading && (!vendors || vendors.length === 0)) {
    return null;
  }

  return (
    <div className="w-full px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Top vendors</h2>
        <hr />

        <div className="flex items-center gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous vendors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next vendors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
        {/* pt-10 reserves room so the logo poking above each card isn't clipped by the carousel viewport */}
        <CarouselContent className="-ml-4 pt-10">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={`skeleton-${i}`}
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4"
                >
                  <VendorCardSkeleton />
                </CarouselItem>
              ))
            : vendors!.map((vendor) => (
                <CarouselItem
                  key={vendor.id}
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4"
                >
                  <VendorCard vendor={vendor} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: RecentVendor }) {
  const hasCover = Boolean(vendor.image1);
  const logoSrc = vendor.users?.profile_image || vendor.image1;
  const hasLogo = Boolean(logoSrc);

  return (
    <div className="relative rounded-md border border-gray-200 bg-white hover:shadow-sm transition-all">
      {/* Logo straddling the top edge of the card: half outside, half inside */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 w-26 h-26 rounded-full overflow-hidden border-2 border-white bg-gray-100 shadow-md flex items-center justify-center">
        {hasLogo ? (
          <Image
            src={logoSrc as string}
            alt={`${vendor.vendor_name ?? "Vendor"} logo`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <Store className="w-6 h-6 text-gray-300" />
        )}
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gray-100">
        {hasCover ? (
          <Image
            src={vendor.image1 as string}
            alt={vendor.vendor_name ?? "Vendor"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-3 space-y-1.5 text-left">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {vendor.vendor_name ?? "Unnamed vendor"}
        </p>
        {vendor.category && (
          <p className="text-xs text-gray-500">{vendor.category}</p>
        )}

        {(vendor.branch || vendor.address) && (
          <div className="flex items-start gap-1 pt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-snug truncate">
              {[vendor.branch, vendor.address].filter(Boolean).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function VendorCardSkeleton() {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 w-20 h-20 rounded-full border-4 border-white bg-gray-200" />
      <div className="w-full aspect-video bg-gray-100" />
      <div className="px-4 pb-4 pt-3 space-y-2">
        <div className="h-3.5 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
    </div>
  );
}