

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  images: string[];
  trending: boolean;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
 const [searchParams] = useSearchParams();
const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [showTrending, setShowTrending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, priceRange, showTrending]);

   useEffect(() => {
  const categoryParam = searchParams.get("category");
  if (categoryParam) {
    setSelectedCategory(categoryParam);
  } else {
    setSelectedCategory("all");
    window.scrollTo({ top: 200, behavior: "smooth" });
  }
}, [searchParams]);


  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (showTrending) {
      filtered = filtered.filter((p) => p.trending);
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Products
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the future of fashion
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Filters</h3>

                {/* Category Filter */}
                <div className="space-y-3 mb-6">
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Jeans">Jeans</SelectItem>
                      <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      <SelectItem value="Shirts">Shirts</SelectItem>
                      <SelectItem value="Hoodies">Hoodies</SelectItem>
                      <SelectItem value="Jackets">Jackets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div className="space-y-3 mb-6">
                  <Label>
                    Price Range: {formatPrice(priceRange[0])} -{" "}
                    {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Trending Filter */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trending"
                    checked={showTrending}
                    onChange={(e) => setShowTrending(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="trending" className="cursor-pointer">
                    Trending Only
                  </Label>
                </div>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-80 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    No products found matching your filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover-lift transition-all duration-300">
                      <Link
                        to={`/products/${product.id}`}
                        className="group block"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                          {product.trending && (
                            <Badge className="absolute top-4 left-4 bg-gold text-background">
                              <Flame className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold mb-1 group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold">
                          {formatPrice(product.price)}
                        </p>
                        {product.stock < 10 && product.stock > 0 && (
                          <p className="text-sm text-destructive mt-1">
                            Only {product.stock} left!
                          </p>
                        )}
                        {product.stock === 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Out of stock
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Link
                            to={`/products/${product.id}`}
                            className="flex-1"
                          >
                            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                              View Details
                            </button>
                          </Link>
                          <Link
                            to={`/design/${product.id}`}
                            className="flex-1"
                          >
                            <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors text-sm font-medium">
                              Customize
                            </button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
