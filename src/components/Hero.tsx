import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 px-4 py-2 rounded-full">
              New Collection 2025
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Wear the
            <span className="block text-gradient mt-2">Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
            Premium menswear redefined. Experience the perfect blend of style, comfort, and innovation with AI-powered customization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
            <Button  variant="hero" size="lg" className="group">
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            </Link>
            <Button variant="outline" size="lg">
              Try AI Virtual Try-On
            </Button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p className="text-2xl font-bold mb-1">1000+</p>
              <p className="text-xs text-muted-foreground">Premium Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">AI</p>
              <p className="text-xs text-muted-foreground">Virtual Try-On</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">24/7</p>
              <p className="text-xs text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-foreground/40 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
