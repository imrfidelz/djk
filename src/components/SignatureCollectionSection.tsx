import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignatureCollectionBanners } from '@/hooks/useSectionBanners';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const SignatureCollectionSection = () => {
  const navigate = useNavigate();
  const { banners, isLoading, hasBanners } = useSignatureCollectionBanners();

  const handleSignatureCollectionClick = () => {
    navigate('/collections?isMain=true');
  };

  if (isLoading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-lg">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-12 w-80 mb-4" />
            <Skeleton className="h-20 w-96 mb-8" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default if no banners
  if (!hasBanners) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <img 
          src="/placeholder.svg" 
          alt="Luxury Collection"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-lg">
            <span className="text-luxury-gold uppercase tracking-wider text-sm font-medium">New Season</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mt-2 mb-4">
              The Signature Collection
            </h2>
            <p className="text-white/80 mb-8">
              Explore our latest exclusive release, featuring handcrafted pieces that embody timeless elegance and uncompromising quality.
            </p>
            <button 
              onClick={handleSignatureCollectionClick}
              className="gold-button"
            >
              View Collection
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Single banner
  if (banners.length === 1) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <img 
          src={banners[0].image}
          alt="Signature Collection"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-lg">
            <span className="text-luxury-gold uppercase tracking-wider text-sm font-medium">New Season</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mt-2 mb-4">
              The Signature Collection
            </h2>
            <p className="text-white/80 mb-8">
              Explore our latest exclusive release, featuring handcrafted pieces that embody timeless elegance and uncompromising quality.
            </p>
            <button 
              onClick={handleSignatureCollectionClick}
              className="gold-button"
            >
              View Collection
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Multiple banners with carousel
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fixed text content over the carousel */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
      <div className="absolute inset-0 z-20 container mx-auto px-4 flex items-center">
        <div className="max-w-lg">
          <span className="text-luxury-gold uppercase tracking-wider text-sm font-medium">New Season</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mt-2 mb-4">
            The Signature Collection
          </h2>
          <p className="text-white/80 mb-8">
            Explore our latest exclusive release, featuring handcrafted pieces that embody timeless elegance and uncompromising quality.
          </p>
          <button 
            onClick={handleSignatureCollectionClick}
            className="gold-button"
          >
            View Collection
          </button>
        </div>
      </div>

      {/* Carousel with only background images */}
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          {banners.map((banner, index) => (
            <CarouselItem key={banner._id} className="h-full">
              <img
                src={banner.image}
                alt={`Signature Collection Banner ${index + 1}`}
                className="w-full h-full object-cover object-center object-top"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {banners.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default SignatureCollectionSection;