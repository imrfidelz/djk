
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_TEMPLATE_PARAMS } from '@/services/emailConfig';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>();
  const { toast } = useToast();

  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/contact` : 'https://DJK.example/contact';

  const onSubmit = async (data: ContactFormValues) => {
    const missingConfig =
      !EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.startsWith('REPLACE') ||
      !EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID.startsWith('REPLACE') ||
      !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.startsWith('REPLACE');

    if (missingConfig) {
      toast({
        title: 'Email not configured',
        description: 'Please add your EmailJS keys to enable sending.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          [EMAILJS_TEMPLATE_PARAMS.from_name]: data.name,
          [EMAILJS_TEMPLATE_PARAMS.from_email]: data.email,
          [EMAILJS_TEMPLATE_PARAMS.subject]: data.subject,
          [EMAILJS_TEMPLATE_PARAMS.message]: data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      toast({
        title: 'Message sent successfully',
        description: 'Thank you! Our team will respond within 24 hours.',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact DJK',
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'DJK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@djk.com',
      telephone: '+1-800-DJK',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
  };

  return (
    <>
      <Helmet>
        <title>Contact DJK - Luxury Customer Support</title>
        <meta name="description" content="Get in touch with DJK customer support for orders, returns, or product questions. We're here to help." />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <header className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help with orders, returns, product recommendations, and more.
            </p>
          </div>
        </header>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact details */}
            <aside className="lg:col-span-1 space-y-6">
              <article className="p-6 rounded-lg border border-luxury-gold/20 bg-muted/30">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-luxury-gold">Customer Care</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <span className="block text-foreground font-medium">Email</span>
                    <a href="mailto:support@djk.com" className="hover:text-luxury-gold">support@djk.com</a>
                  </li>
                  <li>
                    <span className="block text-foreground font-medium">Phone</span>
                    <a href="tel:1-800-DJK" className="hover:text-luxury-gold">1-800-DJK</a>
                  </li>
                  <li>
                    <span className="block text-foreground font-medium">Hours</span>
                    Mon-Fri, 9:00-18:00 (EST)
                  </li>
                </ul>
              </article>

              <article className="p-6 rounded-lg border border-luxury-gold/20">
                <h3 className="text-xl font-semibold mb-2">Press & Partnerships</h3>
                <p className="text-muted-foreground mb-3">For media inquiries and collaborations:</p>
                <a href="mailto:press@djk.com" className="outline-button inline-flex">press@djk.com</a>
              </article>

              <article className="p-6 rounded-lg border border-luxury-gold/20">
                <h3 className="text-xl font-semibold mb-2">Showroom (By Appointment)</h3>
                <p className="text-muted-foreground">5th Avenue, Lekki Lagos, NG</p>
              </article>
            </aside>

            {/* Form */}
            <article className="lg:col-span-2 p-6 md:p-8 rounded-lg border border-luxury-gold/20 bg-card shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Full name</label>
                    <Input id="name" {...register('name', { required: 'Your name is required' })} placeholder="Jane Doe" aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input id="email" type="email" {...register('email', { required: 'Email is required' })} placeholder="jane@DJK.com" aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <Input id="subject" {...register('subject', { required: 'Subject is required' })} placeholder="I have a question about..." aria-invalid={!!errors.subject} />
                  {errors.subject && <p className="mt-2 text-sm text-destructive">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea id="message" rows={6} {...register('message', { required: 'Please enter a message' })} placeholder="Write your message here..." aria-invalid={!!errors.message} />
                  {errors.message && <p className="mt-2 text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">We usually reply within one business day.</p>
                  <Button type="submit" disabled={isSubmitting} className="gold-button">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground mb-4">Prefer email?</p>
            <a href="mailto:support@djk.com" className="gold-button">Email support@djk.com</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
