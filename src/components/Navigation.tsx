import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, LogOut, Wallet, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { SearchBar } from "@/components/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-tighter">
                UVA
              </h1>
              <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                Wear the Future
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/products" className="text-sm font-medium hover:text-accent transition-colors">
                Shop
              </Link>
              <a href="#new" className="text-sm font-medium hover:text-accent transition-colors">
                New Arrivals
              </a>
              <a href="#ai-tryon" className="text-sm font-medium hover:text-accent transition-colors">
                AI Try-On
              </a>
              <a href="#design" className="text-sm font-medium hover:text-accent transition-colors">
                Custom Design
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/wallet" className="cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setAuthModalOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              {/* Mobile Search Sheet */}
              <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto">
                  <div className="py-4">
                    <SearchBar isMobile />
                  </div>
                  <div className="flex flex-col space-y-4 mt-6">
                    <Link 
                      to="/products" 
                      className="text-base font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileSearchOpen(false)}
                    >
                      Shop
                    </Link>
                    <a 
                      href="#new" 
                      className="text-base font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileSearchOpen(false)}
                    >
                      New Arrivals
                    </a>
                    <a 
                      href="#ai-tryon" 
                      className="text-base font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileSearchOpen(false)}
                    >
                      AI Try-On
                    </a>
                    <a 
                      href="#design" 
                      className="text-base font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileSearchOpen(false)}
                    >
                      Custom Design
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Navigation;
