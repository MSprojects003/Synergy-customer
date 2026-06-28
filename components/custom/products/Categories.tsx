"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const categories = [
  "All Products",
  "Power Tools",
  "Hand Tools",
  "Electrical",
  "Plumbing",
  "Painting Supplies",
  "Safety Equipment",
  "Garden Tools",
  "Fasteners",
  "Measuring Tools",
  "Welding Equipment",
];

interface CategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Categories({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CategoriesProps) {
  return (
    <div className="sticky top-2">
      <Sidebar className="border border-gray-200 bg-white rounded-none overflow-hidden shadow-sm fixed top-[80.5px] h-[calc(100vh-80.5px)] flex flex-col">
        <SidebarHeader className="p-6 py-2 border-b bg-white shrink-0">
          <h2 className="text-2xl font-semibold tracking-tight">---</h2>
        </SidebarHeader>

        <SidebarContent className="p-2 overflow-y-auto flex-1">
          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Categories List */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => (
                  <SidebarMenuItem key={category}>
                    <SidebarMenuButton
                      isActive={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full h-12 text-[15px] font-medium",
                        selectedCategory === category && " text-blue-950 hover:text-blue-900"
                      )}
                    >
                      {category}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}