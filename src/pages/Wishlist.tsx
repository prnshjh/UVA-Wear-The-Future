import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      toast({
        title: 'Login Required',
        description: 'Please login to view your wishlist',
        variant: 'destructive',
      });
    }
  }, [user, authLoading, navigate]);

  const handleMoveToCart = async (productId: string) => {
    try {
      // Add to cart with default size (user can change later)
      await addToCart(productId, 'M');
      // Remove from wishlist
      await removeFromWishlist(productId);
      toast({
        title: 'Moved to Cart',
        description: 'Item moved to your cart successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to move item to cart',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            
            <p className="text-muted-foreground text-lg">
              {wishlistItems.length > 0 
                ? `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved for later`
                : 'Your collection of favorites'}
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 p-8 bg-secondary rounded-full">
                <Heart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Start adding your favorite items to create your perfect collection
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
            </div>
          )}

          {/* Wishlist Grid */}
          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <Card 
                    key={item.id}
                    className="group overflow-hidden border-0 shadow-none hover:shadow-xl transition-all duration-300 bg-transparent"
                  >
                    {/* Image Container */}
                    <Link to={`/products/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-lg mb-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="text-xs font-semibold px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-base group-hover:text-accent transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold">₹{product.price.toLocaleString()}</p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleMoveToCart(product.id)}
                        >
                          <ShoppingBag className="mr-1 h-4 w-4" />
                          Move to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
