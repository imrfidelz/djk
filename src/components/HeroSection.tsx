
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroBanners } from '@/hooks/useHeroBanners';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const HeroSection = () => {
  const { heroBanners, isLoading, hasHeroBanners } = useHeroBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (!hasHeroBanners || heroBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [hasHeroBanners, heroBanners.length]);

  if (isLoading) {
    return (
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-gray-200">
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <Skeleton className="h-16 w-96 mb-6" />
          <Skeleton className="h-6 w-80 mb-8" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default hero if no hero banners
  if (!hasHeroBanners) {
    return (
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src="/placeholder.svg"
          alt="Luxury Fashion Collection" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 max-w-2xl leading-tight">
            Discover The New Luxury Collection
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl">
            Timeless elegance crafted with precision and passion for the discerning individual
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/collections?new=true" className="gold-button">
              Shop New Arrivals
            </Link>
            <Link to="/collections" className="outline-button bg-black/30 border-white text-white hover:bg-white hover:text-black">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Single hero banner
  if (heroBanners.length === 1) {
    return (
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src={heroBanners[0].image}
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 max-w-2xl leading-tight">
            Discover The New Luxury Collection
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl">
            Timeless elegance crafted with precision and passion for the discerning individual
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/collections?new=true" className="gold-button">
              Shop New Arrivals
            </Link>
            <Link to="/collections" className="outline-button bg-black/30 border-white text-white hover:bg-white hover:text-black">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Multiple hero banners with carousel
  return (
  <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
    {/* Fixed text content over the carousel */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 container mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 max-w-2xl leading-tight">
        Discover The New Luxury Collection
      </h1>
      <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl">
        Timeless elegance crafted with precision and passion for the discerning individual
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/collections?new=true" className="gold-button">
          Shop New Arrivals
        </Link>
        <Link to="/collections" className="outline-button bg-black/30 border-white text-white hover:bg-white hover:text-black">
          Explore Collections
        </Link>
      </div>
    </div>

    {/* Background images with auto-slide */}
    {heroBanners.map((banner, index) => (
      <div
        key={banner._id}
        className={cn(
          'absolute inset-0 bg-cover bg-center transition-opacity duration-1000',
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        )}
        style={{ backgroundImage: `url(${banner.image})` }}
      />
    ))}
    
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
  </section>
  );
};

export default HeroSection;
