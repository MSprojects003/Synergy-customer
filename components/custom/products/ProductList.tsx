"use client";

import { useState, useMemo } from "react";
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

const products = [
  { id: 1, name: "Cordless Drill", price: 89.99, category: "Power Tools", rating: 4.8, image: "/placeholder-products/drill-1.jpg", imageBack: "/placeholder-products/drill-2.jpg" },
  { id: 2, name: "Hammer Set", price: 29.99, category: "Hand Tools", rating: 4.5, image: "/placeholder-products/hammer-1.jpg", imageBack: "/placeholder-products/hammer-2.jpg" },
  { id: 3, name: "LED Work Light", price: 45.50, category: "Electrical", rating: 4.9, image: "/placeholder-products/light-1.jpg", imageBack: "/placeholder-products/light-2.jpg" },
  { id: 4, name: "Pipe Wrench", price: 18.99, category: "Plumbing", rating: 4.2, image: "/placeholder-products/wrench-1.jpg", imageBack: "/placeholder-products/wrench-2.jpg" },
];

interface ProductListProps {
  selectedCategory: string;
  searchQuery: string;
}

export default function ProductList({ selectedCategory, searchQuery }: ProductListProps) {
  const [sortOption, setSortOption] = useState<"best-match" | "low-high" | "high-low">("best-match");
  const [localSearch, setLocalSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All Products") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search (global + local)
    const query = (searchQuery + " " + localSearch).trim().toLowerCase();
    if (query) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortOption === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }
    // "best-match" keeps original order (you can improve later with relevance)

    return result;
  }, [selectedCategory, searchQuery, localSearch, sortOption]);

  return (
    <div>
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-sans text-gray-900">
          {selectedCategory === "All Products" ? "All Products" : selectedCategory}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Local Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
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
        {filteredProducts.map((product) => (
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