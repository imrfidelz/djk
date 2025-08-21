import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import SignatureCollectionSection from "@/components/SignatureCollectionSection";
import CommitmentSection from "@/components/CommitmentSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

const Index = () => {
  const navigate = useNavigate();

  // Fetch data from backend
  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  // Filter only live products
  const liveProducts = allProducts.filter(product => product.isLive);

  // Filter products for different sections
  const trendingProducts = liveProducts.filter(product => product.isHotDeal).slice(0, 8);
  const bestSellers = liveProducts.filter(product => product.isFeatured).slice(0, 8);
  const mainProducts = liveProducts.filter(product => product.isMain);

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

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/collections?category=${encodeURIComponent(getCategoryName(categoryId))}`);
  };

  // Handle signature collection click
  const handleSignatureCollectionClick = () => {
    navigate('/collections?isMain=true');
  };

  // Add scroll reveal animation
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      revealElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Show loading state
  if (productsLoading || categoriesLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen">
          {/* Hero Section Skeleton */}
          <HeroSection />

          {/* Categories Section Skeleton */}
          <section className="section-padding">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-96 mx-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Products Section Skeleton */}
          <section className="section-padding">
            <div className="container mx-auto">
              <div className="flex justify-between items-end mb-10">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section with Dynamic Banners */}
      <HeroSection />

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Shop By Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your perfect piece from our carefully curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`reveal reveal-delay-${index * 200} relative overflow-hidden group h-80 w-full text-left`}
              >
                <div className="absolute inset-0 bg-black/30 z-10 transition-opacity group-hover:bg-black/40"></div>
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-serif text-2xl text-white mb-2">{category.name}</h3>
                    <span className="inline-flex items-center text-sm text-white bg-luxury-gold bg-opacity-80 px-4 py-2">
                      Shop Now <ArrowRight size={16} className="ml-2" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <SignatureCollectionSection />

      {/* Trending Products */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-10 reveal">
            <h2 className="font-serif text-3xl">Trending Now</h2>
            <Link to="/collections" className="text-sm flex items-center text-luxury-gold hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {trendingProducts.length > 0 ? (
            <div className="reveal">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {trendingProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/4">
                      <ProductCard 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.mainImage}
                        category={getCategoryName(product.category)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No trending products available at the moment.</p>
              <Link to="/collections" className="gold-button mt-4 inline-block">
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-luxury-beige bg-opacity-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-10 reveal">
            <h2 className="font-serif text-3xl">Best Sellers</h2>
            <Link to="/collections" className="text-sm flex items-center text-luxury-gold hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {bestSellers.length > 0 ? (
            <div className="reveal">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {bestSellers.map((product) => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/4">
                      <ProductCard 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.mainImage}
                        category={getCategoryName(product.category)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No best sellers available at the moment.</p>
              <Link to="/collections" className="gold-button mt-4 inline-block">
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Brand Section */}
      <CommitmentSection />

      {/* Social Media Section */}
      <section className="section-padding bg-luxury-beige bg-opacity-20">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Follow Our Style</h2>
            <p className="text-gray-600">Connect with us on social media and share your style with #DJKstyle</p>
          </div>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {[
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: MessageCircle, href: 'https://tiktok.com', label: 'TikTok' }
            ].map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`reveal reveal-delay-${index * 100} group relative p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2`}
                  aria-label={`Follow us on ${social.label}`}
                >
                  <IconComponent 
                    size={32} 
                    className="text-luxury-gold group-hover:text-primary transition-colors duration-300" 
                  />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Index;
