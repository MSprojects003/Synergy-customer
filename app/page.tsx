import { Button } from "@/components/ui/button"
import { HomeSearchParams } from "@/components/home-search-params";
import { Suspense } from "react";
import Banner from "@/components/custom/home/Banner";
import ServiceCarousel from "@/components/custom/home/ServiceCards";
import RecentVendors from "@/components/custom/home/RecentVendors";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HomeSearchParams />
      </Suspense>
      <div >
         <Banner />
         <ServiceCarousel />
         <RecentVendors />
      </div>
    </>
  );
}
