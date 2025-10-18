// import { useEffect, useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { Search, ShoppingBag } from 'lucide-react';
// import Navigation from '@/components/Navigation';
// import Footer from '@/components/Footer';
// import ProductCard from '@/components/ProductCard';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { supabase } from '@/integrations/supabase/client';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   images: string[];
//   category: string;
//   description?: string;
// }

// const SearchResults = () => {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get('q') || '';
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (!query.trim()) {
//         setProducts([]);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from('products')
//           .select('*')
//           .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`);

//         if (error) throw error;
//         setProducts(data || []);
//       } catch (error) {
//         console.error('Search error:', error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSearchResults();
//   }, [query]);

//   return (
//     <>
//       <Navigation />
//       <div className="min-h-screen pt-20 pb-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-12">
//             <div className="flex items-center gap-3 mb-4">
//               <Search className="h-8 w-8 text-accent" />
//               <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
//             </div>
            
//             {query && (
//               <p className="text-muted-foreground text-lg">
//                 {loading ? (
//                   'Searching...'
//                 ) : (
//                   <>
//                     {products.length > 0 ? (
//                       <>
//                         Found <span className="font-semibold text-foreground">{products.length}</span> product
//                         {products.length > 1 ? 's' : ''} matching "
//                         <span className="font-semibold text-foreground">{query}</span>"
//                       </>
//                     ) : (
//                       <>
//                         No products found for "
//                         <span className="font-semibold text-foreground">{query}</span>"
//                       </>
//                     )}
//                   </>
//                 )}
//               </p>
//             )}
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="space-y-3">
//                   <Skeleton className="aspect-[3/4] w-full rounded-lg" />
//                   <Skeleton className="h-5 w-3/4" />
//                   <Skeleton className="h-6 w-1/2" />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty State - No Query */}
//           {!loading && !query && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="mb-6 p-8 bg-secondary rounded-full">
//                 <Search className="h-16 w-16 text-muted-foreground" />
//               </div>
//               <h2 className="text-2xl font-semibold mb-3">Start Searching</h2>
//               <p className="text-muted-foreground mb-8 text-center max-w-md">
//                 Use the search bar above to find your favorite products
//               </p>
//               <Button asChild size="lg">
//                 <Link to="/products">
//                   <ShoppingBag className="mr-2 h-5 w-5" />
//                   Browse All Products
//                 </Link>
//               </Button>
//             </div>
//           )}

//           {/* Empty State - No Results */}
//           {!loading && query && products.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="mb-6 p-8 bg-secondary rounded-full">
//                 <Search className="h-16 w-16 text-muted-foreground" />
//               </div>
//               <h2 className="text-2xl font-semibold mb-3">No Products Found</h2>
//               <p className="text-muted-foreground mb-8 text-center max-w-md">
//                 We couldn't find any products matching your search. Try different keywords or browse our collection.
//               </p>
//               <Button asChild size="lg">
//                 <Link to="/products">
//                   <ShoppingBag className="mr-2 h-5 w-5" />
//                   Browse All Products
//                 </Link>
//               </Button>
//             </div>
//           )}

//           {/* Results Grid */}
//           {!loading && products.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   id={product.id}
//                   image={product.images[0]}
//                   name={product.name}
//                   price={product.price}
//                   category={product.category}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default SearchResults;
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Searching for:', query); // Debug log
        
        // Search across name, category, and description
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`);

        if (error) {
          console.error('Search error:', error);
          throw error;
        }
        
        console.log('Search results:', data); // Debug log
        setProducts(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Format price for display
  const formatPrice = (price: number) => {
    return price / 100;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-8 w-8 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
            </div>
            
            {query && (
              <p className="text-muted-foreground text-lg">
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    {products.length > 0 ? (
                      <>
                        Found <span className="font-semibold text-foreground">{products.length}</span> product
                        {products.length > 1 ? 's' : ''} matching "
                        <span className="font-semibold text-foreground">{query}</span>"
                      </>
                    ) : (
                      <>
                        No products found for "
                        <span className="font-semibold text-foreground">{query}</span>"
                      </>
                    )}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State - No Query */}
          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 p-8 bg-secondary rounded-full">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Start Searching</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Use the search bar above to find your favorite products
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}

          {/* Empty State - No Results */}
          {!loading && query && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 p-8 bg-secondary rounded-full">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">No Products Found</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                We couldn't find any products matching your search. Try different keywords or browse our collection.
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0] || '/placeholder.svg'}
                  name={product.name}
                  price={formatPrice(product.price)}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;