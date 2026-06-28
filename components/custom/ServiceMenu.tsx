"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const services = [
  { name: "Salon", href: "/services/salon", subtext: "Hair & Beauty" },
  { name: "Technician", href: "/services/technician", subtext: "Home Repairs" },
  { name: "Electrician", href: "/services/electrician", subtext: "Electrical Work" },
  { name: "Welding", href: "/services/welding", subtext: "Fabrication" },
  { name: "Interior Design", href: "/services/interior-design", subtext: "Home Styling" },
  { name: "Bridal Services", href: "/services/bridal", subtext: "Wedding Makeup" },
  { name: "Architectural", href: "/services/architectural", subtext: "Design & Planning" },
  { name: "Garden Cleaning", href: "/services/garden-cleaning", subtext: "Landscaping" },
  { name: "Home Decorator", href: "/services/home-decorator", subtext: "Interior Decor" },
  { name: "Catering", href: "/services/catering", subtext: "Food Services" },
  { name: "Garbage Disposal", href: "/services/garbage-disposal", subtext: "Waste Management" },
];

export default function ServiceMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors h-10 px-4"
        >
          Services
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        className="w-[550px] p-4 shadow-2xl border border-gray-100 rounded-3xl"
        sideOffset={10}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              onClick={() => setIsOpen(false)}
              className="group p-5 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200"
            >
              <div className="font-semibold text-gray-900 text-[15px] group-hover:text-blue-600 transition-colors">
                {service.name}
              </div>
              <p className="text-sm text-gray-500 mt-1.5 leading-tight">
                {service.subtext}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link 
            href="/services" 
            onClick={() => setIsOpen(false)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-2 hover:underline"
          >
            View All Services →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}