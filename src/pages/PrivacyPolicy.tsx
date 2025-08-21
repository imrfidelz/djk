
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - DJK</title>
        <meta name="description" content="Learn about how DJK collects, uses, and protects your personal information." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                DJK ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
              </p>
              <p className="text-muted-foreground">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer service</li>
                <li>Participate in surveys or promotions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Types of Personal Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Name and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Email address and phone number</li>
                <li>Order history and preferences</li>
                <li>Communications with us</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Processing and fulfilling your orders</li>
                <li>Managing your account and providing customer service</li>
                <li>Sending you updates about your orders</li>
                <li>Communicating with you about products, services, and promotions</li>
                <li>Personalizing your shopping experience</li>
                <li>Improving our website and services</li>
                <li>Preventing fraud and enhancing security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">How We Share Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
              <p className="text-muted-foreground mb-4">
                We work with trusted third-party service providers who assist us in operating our business:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Payment processors</li>
                <li>Shipping and logistics companies</li>
                <li>Email marketing platforms</li>
                <li>Website analytics providers</li>
                <li>Customer service platforms</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
              <p className="text-muted-foreground mb-6">
                We may disclose your information if required by law or in response to valid requests by public authorities.
              </p>

              <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
              <p className="text-muted-foreground mb-6">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits</li>
                <li>Access controls and employee training</li>
                <li>PCI DSS compliance for payment processing</li>
              </ul>
              <p className="text-muted-foreground">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Access: Request access to your personal information</li>
                <li>Correction: Request correction of inaccurate information</li>
                <li>Deletion: Request deletion of your personal information</li>
                <li>Portability: Request a copy of your data in a portable format</li>
                <li>Restriction: Request restriction of processing</li>
                <li>Objection: Object to certain types of processing</li>
                <li>Withdraw consent: Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-muted-foreground">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Types of Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                <li><strong>Performance Cookies:</strong> Help us analyze website usage</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
              </ul>
              
              <p className="text-muted-foreground">
                You can control cookies through your browser settings, but disabling certain cookies may affect website functionality.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers are made in accordance with applicable data protection laws and with appropriate safeguards in place.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/30 p-6 rounded-lg">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> privacy@DJK.com</p>
                <p className="text-muted-foreground mb-2"><strong>Phone:</strong> 1-800-DJK</p>
                <p className="text-muted-foreground mb-2"><strong>Address:</strong> DJK Privacy Office</p>
                <p className="text-muted-foreground">123 Luxury Avenue, Suite 100, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
