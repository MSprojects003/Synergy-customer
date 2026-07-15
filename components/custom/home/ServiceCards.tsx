// components/custom/services/ServiceCarousel.tsx
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Scissors,
  Wrench,
  Zap,
  Flame,
  Sofa,
  Heart,
  Ruler,
  Trees,
  PaintRoller,
  UtensilsCrossed,
  Trash2,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

type Service = {
  name: string;
  icon: LucideIcon;
};

const services: Service[] = [
  { name: "Salon", icon: Scissors },
  { name: "Technician", icon: Wrench },
  { name: "Electrician", icon: Zap },
  { name: "Welding", icon: Flame },
  { name: "Interior Design", icon: Sofa },
  { name: "Bridal", icon: Heart },
  { name: "Architectural", icon: Ruler },
  { name: "Garden Cleaning", icon: Trees },
  { name: "Home Decorator", icon: PaintRoller },
  { name: "Catering", icon: UtensilsCrossed },
  { name: "Garbage Disposal", icon: Trash2 },
  { name: "General", icon: LayoutGrid },
];

export default function ServiceCarousel() {
  const autoplay = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  return (
    <div className="w-full px-8 py-10">
      <Carousel
        opts={{
          loop: true,
          align: "start",
          slidesToScroll: 1,
        }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <CarouselItem
                key={service.name}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/4" // 4 cards on large screens
              >
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-gray-300 shadow-md bg-white py-8 px-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-base font-semibold text-gray-800 text-center leading-tight group-hover:text-gray-600 transition-colors">
                    {service.name}
                  </p>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}