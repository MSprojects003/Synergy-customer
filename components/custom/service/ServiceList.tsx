// components/ServiceList.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useServicesByCategory } from "@/hooks/UseServices";

type ServiceListProps = {
  service: string;
  serviceDisplayName: string;
};

export default function ServiceList({ service, serviceDisplayName }: ServiceListProps) {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, error } = useServicesByCategory(service);

  // Filter by service name only, on top of the data already scoped to this category.
  const professionals = (data ?? []).filter((s) =>
    s.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      {/* Header row: title + subtext on the left, search on the right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {serviceDisplayName}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse trusted professionals for {serviceDisplayName.toLowerCase()}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${serviceDisplayName.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-sm border border-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
          />
        </div>
      </div>

      {/* Cards Grid -- 2 / 3 / 4 / 5 per row as space allows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-5">
        {isLoading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-sm">Loading professionals…</p>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-500 text-sm">
              {error instanceof Error ? error.message : "Something went wrong loading services."}
            </p>
          </div>
        ) : professionals.length > 0 ? (
          professionals.map((pro) => (
            <ServiceCard
              key={pro.id}
              id={pro.id}
              vendorName={pro.vendor?.vendor_name ?? "Unknown vendor"}
              serviceName={pro.name}
              category={pro.category}
              image={pro.image_url}
              price={pro.price}
              priceType={pro.price_type}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500">
              No professionals found{query ? ` for "${query}"` : ""} in {serviceDisplayName}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}