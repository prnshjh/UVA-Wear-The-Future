import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  category: string;
  sizes?: string[];
}

const ProductCard = ({ id, image, name, price, category, sizes = ['S', 'M', 'L', 'XL'] }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeSelect, setShowSizeSelect] = useState(false);
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeSelect(true);
      toast({
        title: 'Select Size',
        description: 'Please select a size before adding to cart',
        variant: 'destructive',
      });
      return;
    }

    addToCart(id, selectedSize);
    setShowSizeSelect(false);
    setSelectedSize('');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-xl transition-all duration-300 bg-transparent">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-lg mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="hero" size="sm" className="mb-2">
            Quick View
          </Button>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
        >
          <Heart 
            className="h-4 w-4 transition-all duration-300" 
            fill={inWishlist ? "currentColor" : "none"}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-base group-hover:text-accent transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">₹{price.toLocaleString()}</p>
        </div>

        {/* Size Selector */}
        {showSizeSelect && (
          <div className="mt-2">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          size="sm" 
          className="w-full"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
