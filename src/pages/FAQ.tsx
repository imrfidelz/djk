
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "We offer free standard shipping (3-5 business days) on orders over $200. Express shipping (1-2 business days) is available for $25. International shipping times vary by destination but typically take 7-14 business days."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination. All international orders may be subject to customs duties and taxes."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and visiting the Orders section."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact customer service immediately if you need to make changes."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your products authentic?",
          answer: "Yes, all DJK products are 100% authentic. We work directly with verified suppliers and master craftsmen to ensure the highest quality and authenticity of every item in our collection."
        },
        {
          question: "What materials are used in your products?",
          answer: "We use only the finest materials including genuine leather, premium metals, natural gemstones, and high-quality fabrics. Each product description includes detailed material information."
        },
        {
          question: "Do you offer product warranties?",
          answer: "Yes, all DJK products come with a 1-year warranty against manufacturing defects. Jewelry items come with a 2-year warranty. The warranty covers craftsmanship issues but does not cover normal wear and tear."
        },
        {
          question: "How do I care for my luxury items?",
          answer: "Each product comes with specific care instructions. Generally, store items in their original packaging, avoid exposure to moisture and direct sunlight, and use appropriate cleaning products. We also offer professional cleaning services for select items."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unworn, unused items in their original packaging. Items must be returned with all original tags and accessories. Custom or personalized items cannot be returned unless defective."
        },
        {
          question: "How do I return an item?",
          answer: "Log into your account, go to Orders, and select 'Return Item' next to the product you wish to return. Print the prepaid return label and ship the item back to us. Refunds are processed within 5-7 business days of receiving the return."
        },
        {
          question: "Can I exchange an item for a different size or color?",
          answer: "Yes, exchanges are available for the same item in a different size or color, subject to availability. The exchange process follows the same procedure as returns, and we'll ship the new item once we receive the original."
        },
        {
          question: "Who pays for return shipping?",
          answer: "We provide free return shipping for defective items or our errors. For other returns, a $15 return shipping fee will be deducted from your refund unless you're exchanging for a different size."
        }
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "Do I need an account to make a purchase?",
          answer: "While you can checkout as a guest, creating an account allows you to track orders, save your preferences, access exclusive offers, and enjoy a faster checkout experience."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. For high-value purchases, we also offer payment plans through our financing partners."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption and comply with PCI DSS standards to protect your payment information. We never store your complete credit card details on our servers."
        },
        {
          question: "Do you offer payment plans?",
          answer: "Yes, we offer flexible payment plans for purchases over $500 through our partners. You can choose from 3, 6, or 12-month payment options with competitive rates."
        }
      ]
    },
    {
      category: "Customer Service",
      questions: [
        {
          question: "How can I contact customer service?",
          answer: "Our customer service team is available Monday-Friday 9AM-6PM EST. You can reach us via email at support@DJK.com, phone at 1-800-DJK, or through live chat on our website."
        },
        {
          question: "Do you offer personal shopping services?",
          answer: "Yes, our personal shopping service is available for VIP customers and purchases over $1,000. Our style consultants can help you select the perfect pieces for your wardrobe or special occasions."
        },
        {
          question: "Can I visit a physical store?",
          answer: "We currently operate as an online-only boutique, but we do host exclusive private shopping events in select cities. VIP customers receive invitations to these special events."
        },
        {
          question: "Do you have a loyalty program?",
          answer: "Yes, our DJK Elite program rewards loyal customers with exclusive access to new collections, special discounts, complimentary services, and invitations to private events. Membership is based on annual purchase volume."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - DJK</title>
        <meta name="description" content="Find answers to frequently asked questions about DJK luxury products, shipping, returns, and customer service." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our luxury products, services, and policies.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-serif font-bold mb-6 text-luxury-gold">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-luxury-gold/20"
                    >
                      <AccordionTrigger className="text-left hover:text-luxury-gold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Our customer service team is here to help you with any questions not covered above.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@DJK.com" 
                className="gold-button"
              >
                Email Support
              </a>
              <a 
                href="tel:1-800-DJK" 
                className="outline-button"
              >
                Call Us
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;
