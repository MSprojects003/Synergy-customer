"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsApi,  Product  } from "@/lib/api/products";
import { Loader2 } from "lucide-react";

interface ProductListProps {
  selectedCategory: string;
  searchQuery: string;
}

export default function ProductList({ selectedCategory, searchQuery }: ProductListProps) {
  const [sortOption, setSortOption] = useState<"best-match" | "low-high" | "high-low">("best-match");
  const [localSearch, setLocalSearch] = useState("");

  // Fetch real data from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All Products") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    const query = (searchQuery + " " + localSearch).trim().toLowerCase();
    if (query) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortOption === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, localSearch, sortOption]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div>
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-sans text-gray-900">
          {selectedCategory === "All Products" ? "All Products" : selectedCategory}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortOption} onValueChange={(value: any) => setSortOption(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-match">Best Match</SelectItem>
              <SelectItem value="low-high">Price: Low to High</SelectItem>
              <SelectItem value="high-low">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-lg">
          No products found for your search.
        </div>
      )}
    </div>
  );
}