// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import heroImage from "@/assets/hero-fashion.jpg";
// import { Link } from "react-router-dom";

// const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: `url(${heroImage})` }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-2xl">
//           <div className="inline-block mb-4">
//             <span className="text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 px-4 py-2 rounded-full">
//               New Collection 2025
//             </span>
//           </div>
          
//           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
//             Wear the
//             <span className="block text-gradient mt-2">Future</span>
//           </h1>
          
//           <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
//             Premium menswear redefined. Experience the perfect blend of style, comfort, and innovation with AI-powered customization.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <Link to="/products">
//             <Button  variant="hero" size="lg" className="group">
//               Shop Collection
//               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             </Button>
//             </Link>
//             <Button variant="outline" size="lg">
//               Try AI Virtual Try-On
//             </Button>
//           </div>

//           {/* Features */}
//           <div className="mt-12 grid grid-cols-3 gap-6">
//             <div>
//               <p className="text-2xl font-bold mb-1">1000+</p>
//               <p className="text-xs text-muted-foreground">Premium Products</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold mb-1">AI</p>
//               <p className="text-xs text-muted-foreground">Virtual Try-On</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold mb-1">24/7</p>
//               <p className="text-xs text-muted-foreground">Support</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-2">
//           <div className="w-1 h-3 bg-foreground/40 rounded-full" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;






import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero background images - Modern fashion photography
  const heroImages = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Fashion ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlay - Creates depth and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-white/40 to-transparent" />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" /> */}
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8 animate-fadeIn">
            {/* New Collection Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold text-white tracking-wide">
                NEW COLLECTION 2025
              </span>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            </div>

            {/* Main Heading - Bold and Impactful */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
                Wear the
                <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                  Future
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light">
                Premium menswear redefined with{' '}
                <span className="font-semibold text-white">AI-powered customization</span>.
                <span className="block mt-3 text-yellow-400 font-semibold text-2xl">
                  Style meets innovation.
                </span>
              </p>
            </div>

            {/* CTA Buttons - Clear call to action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative h-14 px-8 overflow-hidden rounded-lg bg-white text-black font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center justify-center">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="group h-14 px-8 rounded-lg bg-transparent text-white border-2 border-white/30 font-semibold text-base backdrop-blur-md hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                <span className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  AI Try-On
                </span>
              </button>
            </div>

            {/* Stats - Social Proof */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-white/20">
              <div className="space-y-1 transform hover:scale-105 transition-transform duration-300">
                <p className="text-3xl md:text-4xl font-bold text-white">1000+</p>
                <p className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">Premium Products</p>
              </div>
              <div className="space-y-1 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
                  <p className="text-3xl md:text-4xl font-bold text-white">AI</p>
                </div>
                <p className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">Virtual Try-On</p>
              </div>
              <div className="space-y-1 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                  <p className="text-3xl md:text-4xl font-bold text-white">24/7</p>
                </div>
                <p className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Modern dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-12 bg-white shadow-lg' 
                : 'w-6 bg-white/40 hover:bg-white/60 hover:w-8'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Elegant detail */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-3 text-white/60 animate-bounce">
        <span className="text-xs font-medium tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-20 bg-gradient-to-b from-white/60 via-white/30 to-transparent" />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;


