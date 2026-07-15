// components/ServiceCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ServiceCardProps = {
  id: string;
  vendorName: string;
  serviceName: string;
  category?: string;
  image: string | null;
  price: number;
  priceType: "fixed" | "hourly";
};

export default function ServiceCard({
  id,
  vendorName,
  serviceName,
  category,
  image,
  price,
  priceType,
}: ServiceCardProps) {
  const priceLabel = priceType === "hourly" ? "/ hr" : "fixed";

  return (
    <Link href={`/service/${id}`} className="block">
      <div className="group relative bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {image && (
            <Image
              src={image}
              alt={serviceName}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            />
          )}

          {/* Arrow affordance on hover -- replaces the button as the "action" cue */}
          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-900" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-1">
          {category && (
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-600">
              {category}
            </span>
          )}

          <h3 className="text-[16px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[1.6em]">
            {serviceName}
          </h3>
          <p className="text-[13.5px] text-gray-500 truncate">{vendorName}</p>

          {/* Price pinned to bottom of card content */}
          <div className="mt-2 pt-3 border-t border-gray-100 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">
              Rs. {price.toLocaleString()}
            </span>
            <span className="text-[13px] text-gray-400">{priceLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}