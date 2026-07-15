// components/custom/Banner.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    alt: "Mountain landscape",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=80",
    alt: "Forest path",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
    alt: "City skyline at night",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    alt: "Beach sunset",
  },
];

export default function Banner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full h-full"
      >
        <CarouselContent className="h-screen ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="relative h-screen pl-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}