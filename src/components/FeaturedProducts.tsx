import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import hoodieImage from "@/assets/product-hoodie.jpg";
import jeansImage from "@/assets/product-jeans.jpg";
import tshirtImage from "@/assets/product-tshirt.jpg";
import jacketImage from "@/assets/product-jacket.jpg";

const products = [
  {
    id: "1",
    name: "Premium Black Hoodie",
    price: 2499,
    category: "Hoodies",
    image: hoodieImage,
  },
  {
    id: "2",
    name: "Classic Denim Jeans",
    price: 3299,
    category: "Jeans",
    image: jeansImage,
  },
  {
    id: "3",
    name: "Essential White Tee",
    price: 899,
    category: "T-Shirts",
    image: tshirtImage,
  },
  {
    id: "4",
    name: "Leather Biker Jacket",
    price: 8999,
    category: "Jackets",
    image: jacketImage,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-accent mb-2 block">
            Trending Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Featured Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium menswear. Each piece is crafted with precision and designed for the modern man.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/products" className="text-sm font-semibold hover:text-accent transition-colors underline underline-offset-4">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
