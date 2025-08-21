import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Grid2X2, LayoutList, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useToast } from "@/hooks/use-toast";
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';
import { formatCurrency } from '@/lib/currency';

const Collections = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sort, setSort] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch only live products from backend
  const { data: liveProducts = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['liveProducts'],
    queryFn: productService.getLive,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  // Log errors for debugging
  useEffect(() => {
    if (productsError) {
      console.error('Products loading error:', productsError);
      toast({
        title: "Error loading products",
        description: productsError.message || "Failed to load products",
        variant: "destructive",
      });
    }
  }, [productsError, toast]);

  // Initialize with URL parameters if present
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const isMainParam = searchParams.get('isMain');
    const newParam = searchParams.get('new');
    
    if (categoryParam && categories.length > 0) {
      // Find category by name
      const category = categories.find(cat => cat.name.toLowerCase() === categoryParam.toLowerCase());
      if (category) {
        setSelectedCategories([category.id]);
        toast({
          title: "Category selected",
          description: `Showing ${category.name} products`,
        });
      }
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
      toast({
        title: "Search results",
        description: `Showing results for "${searchParam}"`,
      });
    }

    if (isMainParam === 'true') {
      toast({
        title: "Signature Collection",
        description: "Showing signature collection products",
      });
    }

    if (newParam === 'true') {
      toast({
        title: "New Arrivals",
        description: "Showing the latest products",
      });
    }
  }, [searchParams, categories, toast]);

  // Auto-adjust price range based on available products
  useEffect(() => {
    if (liveProducts.length > 0) {
      const prices = liveProducts.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [liveProducts]);
  
  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = [...liveProducts];
    
    // Apply isMain filter from URL parameter
    const isMainParam = searchParams.get('isMain');
    if (isMainParam === 'true') {
      filtered = filtered.filter(product => product.isMain);
    }

    // Apply new arrivals filter from URL parameter
    const newParam = searchParams.get('new');
    if (newParam === 'true') {
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(product => {
        const dateStr: any = (product as any).liveAt || product.lastUpdated;
        const date = new Date(dateStr as any).getTime();
        return !isNaN(date) && (now - date) <= THIRTY_DAYS;
      });
    }
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const category = categories.find(c => c.id === product.category);
        const brand = brands.find(b => b.id === product.brand);
        
        return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (category && category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
               (brand && brand.name.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }
    
    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    );
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }
    
    // Sort products
    switch(sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting - no change
        break;
    }
    
    return filtered;
  }, [liveProducts, priceRange, selectedCategories, selectedBrands, sort, searchQuery, categories, brands, searchParams]);
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(b => b !== brandId) 
        : [...prev, brandId]
    );
  };
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    
    setSearchParams(searchParams);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchQuery("");
    searchParams.delete('category');
    searchParams.delete('search');
    searchParams.delete('isMain');
    searchParams.delete('new');
    setSearchParams(searchParams);
    
    // Reset price range to full range
    if (liveProducts.length > 0) {
      const prices = liveProducts.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
    
    toast({
      title: "Filters cleared",
      description: "Showing all live products",
    });
  };
  
  // Function to get page title based on selected category or search
  const getPageTitle = () => {
    const isMainParam = searchParams.get('isMain');
    const newParam = searchParams.get('new');
    
    if (newParam === 'true') {
      return "New Arrivals";
    }
    
    if (isMainParam === 'true') {
      return "Signature Collection";
    }
    
    if (searchQuery) {
      return `Search Results: ${searchQuery}`;
    }
    
    if (selectedCategories.length === 1) {
      const category = categories.find(c => c.id === selectedCategories[0]);
      return category ? category.name : "Shop";
    }
    
    return "Shop";
  };

  // Helper function to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Helper function to get brand name
  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown';
  };

  if (productsLoading || categoriesLoading || brandsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-4">Unable to load products</h2>
              <p className="text-muted-foreground mb-4">
                Error: {productsError.message}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Please check your internet connection and try again
              </p>
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-luxury-gold">Home</Link> / <span>{getPageTitle()}</span>
        </div>
        
        <h1 className="text-3xl font-serif mb-8">{getPageTitle()}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4 lg:w-1/5">
            <Card className="p-6 sticky top-24">
              {/* Search Filter (Mobile only) */}
              <div className="mb-6 md:hidden">
                <form onSubmit={handleSearch}>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-luxury-gold hover:bg-opacity-90">
                      <Search size={18} />
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Price Filter */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Filter by price</h2>
                <Slider
                  min={0}
                  max={Math.max(...liveProducts.map(p => p.price), 1000)}
                  step={1}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm mb-4">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
              
              {/* Categories Filter */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 uppercase">Filter by categories</h2>
                <ul className="space-y-2 text-sm">
                  {categories.map(category => {
                    const productCount = liveProducts.filter(p => p.category === category.id).length;
                    return (
                      <li key={category.id} className="flex items-center">
                        <button
                          className={`text-left hover:text-luxury-gold ${selectedCategories.includes(category.id) ? 'text-luxury-gold' : 'text-gray-600'}`}
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.name} ({productCount})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Brands Filter */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 uppercase">Filter by brands</h2>
                <ul className="space-y-2 text-sm">
                  {brands.map(brand => {
                    const productCount = liveProducts.filter(p => p.brand === brand.id).length;
                    return (
                      <li key={brand.id} className="flex items-center">
                        <button
                          className={`text-left hover:text-luxury-gold ${selectedBrands.includes(brand.id) ? 'text-luxury-gold' : 'text-gray-600'}`}
                          onClick={() => toggleBrand(brand.id)}
                        >
                          {brand.name} ({productCount})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              {/* Clear Filters Button */}
              <Button 
                className="w-full bg-luxury-gold hover:bg-opacity-90"
                onClick={clearFilters}
              >
                CLEAR FILTERS
              </Button>
            </Card>
          </div>
          
          {/* Products Grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {/* Search bar (desktop) and Product Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              {/* Search Bar (Desktop) */}
              <form onSubmit={handleSearch} className="hidden md:flex w-full md:w-auto items-center">
                <div className="relative w-full md:w-80">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-luxury-gold"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
              
              <div className="flex items-center justify-between w-full md:w-auto">
                <p className="text-gray-500">Showing {filteredProducts.length} results</p>
                
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode("grid")} 
                      className={`p-1 ${viewMode === "grid" ? "text-luxury-gold" : "text-gray-400"}`}
                    >
                      <Grid2X2 size={20} />
                    </button>
                    <button 
                      onClick={() => setViewMode("list")} 
                      className={`p-1 ${viewMode === "list" ? "text-luxury-gold" : "text-gray-400"}`}
                    >
                      <LayoutList size={20} />
                    </button>
                  </div>
                  
                  {/* Sorting */}
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Default sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default sorting</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-serif mb-4">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No results for "${searchQuery}". Try different keywords or browse our other categories.`
                    : "Try adjusting your filters or browse our other categories."
                  }
                </p>
                <Button 
                  className="bg-luxury-gold hover:bg-opacity-90"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              /* Products Grid/List */
              <div className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="reveal">
                    {viewMode === "grid" ? (
                      <ProductCard 
                        id={product.id} 
                        name={product.name}
                        price={product.price}
                        image={product.mainImage}
                        category={getCategoryName(product.category)}
                      />
                    ) : (
                      <div className="flex gap-6 border p-4">
                        <div className="w-1/3">
                          <Link to={`/product/${product.id}`} className="block hover:opacity-90">
                            <img 
                              src={product.mainImage} 
                              alt={product.name}
                              className="w-full h-auto object-cover"
                            />
                          </Link>
                        </div>
                        <div className="w-2/3 flex flex-col justify-between">
                          <div>
                            <p className="text-xs uppercase text-gray-500">{getCategoryName(product.category)}</p>
                            <h3 className="font-serif text-sm lg:text-base">{product.name}</h3>
                            <p className="font-medium mt-1 text-sm lg:text-base">{formatCurrency(product.price)}</p>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                          </div>
                          <Button 
                            className="mt-4 bg-luxury-gold hover:bg-opacity-90 w-fit"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Added to cart",
                                description: `${product.name} has been added to your cart.`,
                              });
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Collections;
