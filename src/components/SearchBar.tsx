// import { useState, useEffect, useRef } from 'react';
// import { Search, X } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   images: string[];
//   category: string;
// }

// interface SearchBarProps {
//   isMobile?: boolean;
// }

// export const SearchBar = ({ isMobile = false }: SearchBarProps) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Product[]>([]);
//   const [showResults, setShowResults] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const navigate = useNavigate();
//   const searchRef = useRef<HTMLDivElement>(null);
//   const debounceTimer = useRef<NodeJS.Timeout>();

//   // Search function with debounce
//   const performSearch = async (searchQuery: string) => {
//     if (!searchQuery.trim()) {
//       setResults([]);
//       setShowResults(false);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const { data, error } = await supabase
//         .from('products')
//         .select('*')
//         .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
//         .limit(5);

//       if (error) throw error;
//       setResults(data || []);
//       setShowResults(true);
//     } catch (error) {
//       console.error('Search error:', error);
//       setResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Debounced search on query change
//   useEffect(() => {
//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }

//     debounceTimer.current = setTimeout(() => {
//       performSearch(query);
//     }, 300);

//     return () => {
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//     };
//   }, [query]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setShowResults(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle Enter key press
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && query.trim()) {
//       setShowResults(false);
//       navigate(`/search?q=${encodeURIComponent(query)}`);
//     }
//   };

//   // Handle result click
//   const handleResultClick = (productId: string) => {
//     setShowResults(false);
//     setQuery('');
//   };

//   // Clear search
//   const clearSearch = () => {
//     setQuery('');
//     setResults([]);
//     setShowResults(false);
//   };

//   return (
//     <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           type="text"
//           placeholder="Search for products (e.g. jeans, jackets, shirts...)"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => query.trim() && setShowResults(true)}
//           className="pl-10 pr-10 h-10 bg-secondary/50 border-border focus-visible:ring-accent"
//         />
//         {query && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={clearSearch}
//             className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       {/* Search Results Dropdown */}
//       {showResults && (
//         <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
//           {isSearching && (
//             <div className="p-4 text-center text-muted-foreground text-sm">
//               Searching...
//             </div>
//           )}

//           {!isSearching && results.length === 0 && query.trim() && (
//             <div className="p-4 text-center text-muted-foreground text-sm">
//               No products found matching "{query}"
//             </div>
//           )}

//           {!isSearching && results.length > 0 && (
//             <>
//               <div className="p-3 border-b border-border">
//                 <p className="text-xs text-muted-foreground">
//                   {results.length} result{results.length > 1 ? 's' : ''} found
//                 </p>
//               </div>
              
//               <div className="py-2">
//                 {results.map((product) => (
//                   <Link
//                     key={product.id}
//                     to={`/products/${product.id}`}
//                     onClick={() => handleResultClick(product.id)}
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
//                   >
//                     <img
//                       src={product.images[0]}
//                       alt={product.name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h4 className="text-sm font-medium truncate">{product.name}</h4>
//                       <p className="text-xs text-muted-foreground">{product.category}</p>
//                     </div>
//                     <div className="text-sm font-semibold">
//                       ₹{product.price.toLocaleString()}
//                     </div>
//                   </Link>
//                 ))}
//               </div>

//               {query.trim() && (
//                 <Link
//                   to={`/search?q=${encodeURIComponent(query)}`}
//                   onClick={() => setShowResults(false)}
//                   className="block p-3 text-center text-sm text-accent hover:bg-secondary border-t border-border transition-colors"
//                 >
//                   View all results for "{query}"
//                 </Link>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface SearchBarProps {
  isMobile?: boolean;
}

export const SearchBar = ({ isMobile = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Search function with debounce
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Search by name and description only (category is ENUM and causes issues with ilike)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }
      
      console.log('Search results:', data); // Debug log
      setResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search on query change
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle result click
  const handleResultClick = (productId: string) => {
    setShowResults(false);
    setQuery('');
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('en-IN');
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for products (e.g. jeans, jackets, shirts...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowResults(true)}
          className="pl-10 pr-10 h-10 bg-secondary/50 border-border focus-visible:ring-accent"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          )}

          {!isSearching && results.length === 0 && query.trim() && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No products found matching "{query}"
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <>
              <div className="p-3 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  {results.length} result{results.length > 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="py-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => handleResultClick(product.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-sm font-semibold">
                      ₹{formatPrice(product.price)}
                    </div>
                  </Link>
                ))}
              </div>

              {query.trim() && (
                <Link
                  to={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setShowResults(false)}
                  className="block p-3 text-center text-sm text-accent hover:bg-secondary border-t border-border transition-colors"
                >
                  View all results for "{query}"
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};