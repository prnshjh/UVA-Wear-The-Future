import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          product:products (
            id,
            name,
            price,
            images,
            category
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wishlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;

      toast({
        title: 'Added to Wishlist',
        description: 'Item added to your wishlist',
      });

      await refreshWishlist();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already in Wishlist',
          description: 'This item is already in your wishlist',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add to wishlist',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: 'Removed from Wishlist',
        description: 'Item removed from your wishlist',
      });

      await refreshWishlist();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from wishlist',
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
