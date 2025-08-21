import React from 'react';
import { Link } from 'react-router-dom';
import { useCommitmentBanners } from '@/hooks/useSectionBanners';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const CommitmentSection = () => {
  const { banners, isLoading, hasBanners } = useCommitmentBanners();

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="reveal">
              <Skeleton className="w-full h-64" />
            </div>
            <div className="reveal reveal-delay-200">
              <Skeleton className="h-10 w-80 mb-6" />
              <Skeleton className="h-20 w-full mb-6" />
              <Skeleton className="h-16 w-full mb-8" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default if no banners
  if (!hasBanners) {
    return (
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="reveal">
              <img 
                src="/placeholder.svg" 
                alt="About DJK" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="reveal reveal-delay-200">
              <h2 className="font-serif text-3xl mb-6">Our Commitment to Excellence</h2>
              <p className="text-gray-600 mb-6">
                Since our founding, we have been dedicated to creating products of exceptional quality and timeless design. Each piece in our collection represents the perfect harmony of artisanal craftsmanship and contemporary aesthetics.
              </p>
              <p className="text-gray-600 mb-8">
                Our artisans work with the finest materials sourced from around the world, ensuring that every item bearing the DJK name meets our exacting standards of excellence.
              </p>
              <Link to="/about" className="outline-button">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Single banner
  if (banners.length === 1) {
    return (
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="reveal">
              <img 
                src={banners[0].image}
                alt="Our Commitment to Excellence" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="reveal reveal-delay-200">
              <h2 className="font-serif text-3xl mb-6">Our Commitment to Excellence</h2>
              <p className="text-gray-600 mb-6">
                Since our founding, we have been dedicated to creating products of exceptional quality and timeless design. Each piece in our collection represents the perfect harmony of artisanal craftsmanship and contemporary aesthetics.
              </p>
              <p className="text-gray-600 mb-8">
                Our artisans work with the finest materials sourced from around the world, ensuring that every item bearing the DJK name meets our exacting standards of excellence.
              </p>
              <Link to="/about" className="outline-button">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Multiple banners with carousel
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <Carousel className="w-full">
              <CarouselContent>
                {banners.map((banner, index) => (
                  <CarouselItem key={banner._id}>
                    <img
                      src={banner.image}
                      alt={`Our Commitment Banner ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {banners.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          </div>
          <div className="reveal reveal-delay-200">
            <h2 className="font-serif text-3xl mb-6">Our Commitment to Excellence</h2>
            <p className="text-gray-600 mb-6">
              Since our founding, we have been dedicated to creating products of exceptional quality and timeless design. Each piece in our collection represents the perfect harmony of artisanal craftsmanship and contemporary aesthetics.
            </p>
            <p className="text-gray-600 mb-8">
              Our artisans work with the finest materials sourced from around the world, ensuring that every item bearing the DJK name meets our exacting standards of excellence.
            </p>
            <Link to="/about" className="outline-button">
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitmentSection;