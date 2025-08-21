
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - DJK</title>
        <meta name="description" content="Learn about DJK's commitment to luxury, craftsmanship, and timeless elegance." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              About DJK
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crafting timeless elegance through exceptional luxury goods that define sophistication and style.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded with a vision to redefine luxury, DJK began as a passion project dedicated to bringing the world's finest craftsmanship to discerning customers who appreciate quality and elegance.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our journey started with a simple belief: that luxury should be accessible to those who value authenticity, heritage, and exceptional design. Every piece in our collection tells a story of meticulous attention to detail and unwavering commitment to excellence.
                </p>
                <p className="text-muted-foreground">
                  Today, DJK stands as a beacon of sophisticated taste, offering carefully curated collections that embody the perfect balance of contemporary style and timeless appeal.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                  <span className="text-luxury-gold font-serif text-2xl">DJK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-luxury-gold font-serif text-xl">Q</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  We source only the finest materials and work with master craftsmen to ensure every product meets our exacting standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-luxury-gold font-serif text-xl">E</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Elegance</h3>
                <p className="text-muted-foreground">
                  Our curated collections reflect timeless sophistication, designed to enhance your personal style with grace and refinement.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-luxury-gold font-serif text-xl">S</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Service</h3>
                <p className="text-muted-foreground">
                  Our commitment to exceptional customer service ensures a seamless and personalized shopping experience from start to finish.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-8">
              To democratize luxury by making exceptional craftsmanship and timeless design accessible to all who appreciate quality and elegance.
            </p>
            <div className="border-t border-luxury-gold/20 pt-8">
              <p className="text-muted-foreground italic">
                "Luxury is not about the price tag, but about the experience, the quality, and the story behind every piece."
              </p>
              <p className="text-sm text-muted-foreground mt-2">— DJK Founders</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
