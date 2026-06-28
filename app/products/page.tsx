"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Categories from "@/components/custom/products/Categories";
import ProductList from "@/components/custom/products/ProductList";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="container mx-auto px-2 lg:px-2 py-8">
        <SidebarProvider>
          <div className="flex gap-0    w-full justify-center">
            {/* Fixed Left Sidebar */}
            <div className="hidden lg:block w-72 sticky top-24 shrink-0">
              <Categories 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Main Products Area */}
            <div className="flex-1 pr-4  min-w-0">
              <ProductList 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}