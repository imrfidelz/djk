
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - DJK</title>
        <meta name="description" content="Read DJK's terms and conditions governing the use of our website and purchase of our luxury products." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Terms and Conditions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services or making a purchase.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            {/* Agreement to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Agreement to Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using the DJK website ("Website") and purchasing our products, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-muted-foreground">
                If you do not agree to abide by the above, please do not use this service or make any purchases from our Website.
              </p>
            </div>

            {/* Definitions */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Definitions</h2>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li><strong>"Company"</strong> (referred to as "we," "us," or "our") means DJK.</li>
                <li><strong>"You"</strong> refers to the individual accessing or using the Website.</li>
                <li><strong>"Products"</strong> means all luxury goods offered for sale on our Website.</li>
                <li><strong>"Services"</strong> means all services provided by DJK, including customer support and personalized shopping assistance.</li>
                <li><strong>"Content"</strong> means all text, images, graphics, videos, and other materials on the Website.</li>
              </ul>
            </div>

            {/* Use License */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access the materials on DJK's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes or public display</li>
                <li>Attempt to reverse engineer any software on the Website</li>
                <li>Remove copyright or proprietary notations from materials</li>
                <li>Create derivative works based on the Website content</li>
              </ul>
              <p className="text-muted-foreground">
                This license shall automatically terminate if you violate any restrictions and may be terminated by us at any time.
              </p>
            </div>

            {/* Product Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Product Information</h2>
              <p className="text-muted-foreground mb-4">
                We strive to provide accurate product information, including descriptions, images, specifications, and pricing. However:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Colors may vary due to monitor settings and lighting conditions</li>
                <li>Product dimensions and weights are approximate</li>
                <li>We reserve the right to correct errors in product information</li>
                <li>Availability is subject to change without notice</li>
                <li>We may discontinue products at any time</li>
              </ul>
            </div>

            {/* Pricing and Payment */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Pricing and Payment</h2>
              
              <h3 className="text-xl font-semibold mb-3">Pricing</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>All prices are displayed in USD unless otherwise stated</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to correct pricing errors</li>
                <li>Taxes and shipping costs are additional unless specified</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Payment Terms</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Payment is due at the time of order placement</li>
                <li>We accept major credit cards, PayPal, and other specified payment methods</li>
                <li>Your payment information must be accurate and current</li>
                <li>We may use third-party payment processors</li>
                <li>Payment plans may be available for qualifying purchases</li>
              </ul>
            </div>

            {/* Orders and Fulfillment */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Orders and Fulfillment</h2>
              
              <h3 className="text-xl font-semibold mb-3">Order Acceptance</h3>
              <p className="text-muted-foreground mb-4">
                Your order is an offer to purchase products. We reserve the right to accept or decline any order. Order confirmation does not guarantee acceptance.
              </p>

              <h3 className="text-xl font-semibold mb-3">Processing Time</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Orders are typically processed within 1-2 business days</li>
                <li>Custom or personalized items may require additional processing time</li>
                <li>We will notify you of any delays</li>
                <li>Processing times may vary during peak seasons</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Shipping</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Shipping costs and timeframes vary by location and service selected</li>
                <li>Risk of loss transfers to you upon delivery to the carrier</li>
                <li>We are not responsible for delays caused by shipping carriers</li>
                <li>International orders may be subject to customs duties and taxes</li>
              </ul>
            </div>

            {/* Returns and Refunds */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Returns and Refunds</h2>
              
              <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Items may be returned within 30 days of delivery</li>
                <li>Items must be unused, unworn, and in original condition</li>
                <li>Original packaging, tags, and accessories must be included</li>
                <li>Custom or personalized items cannot be returned unless defective</li>
                <li>Sale items may have different return policies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Refund Process</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Refunds are processed within 5-7 business days of receiving the return</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Original shipping costs are non-refundable unless item is defective</li>
                <li>Return shipping costs are the customer's responsibility unless otherwise specified</li>
              </ul>
            </div>

            {/* Warranties */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Warranties</h2>
              
              <h3 className="text-xl font-semibold mb-3">Product Warranties</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>All products come with a manufacturer's warranty against defects</li>
                <li>Warranty periods vary by product type and are specified in product descriptions</li>
                <li>Warranties cover manufacturing defects but not normal wear and tear</li>
                <li>Warranty claims must be accompanied by proof of purchase</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Disclaimer</h3>
              <p className="text-muted-foreground">
                Except as expressly stated, all products are provided "as is" without any warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.
              </p>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">User Conduct</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to use the Website for any unlawful purpose or in any way that could damage or impair the Website. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Transmitting viruses or malicious code</li>
                <li>Attempting to gain unauthorized access to systems</li>
                <li>Interfering with other users' experience</li>
                <li>Making fraudulent purchases</li>
                <li>Using automated systems to access the Website</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The Website and its original content, features, and functionality are owned by DJK and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>All trademarks, logos, and brand names are property of their respective owners</li>
                <li>You may not use our trademarks without written permission</li>
                <li>Product images and descriptions are protected by copyright</li>
                <li>Unauthorized use of our intellectual property is prohibited</li>
              </ul>
            </div>

            {/* Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Privacy</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Website, to understand our practices regarding the collection and use of your personal information.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                In no event shall DJK or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Website, even if DJK or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              <p className="text-muted-foreground">
                Our total liability to you for any damages shall not exceed the amount you paid for the specific product or service that is the subject of the claim.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless DJK and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the Website or violation of these Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms and Conditions are governed by and construed in accordance with the laws of New York, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Dispute Resolution</h2>
              <p className="text-muted-foreground mb-4">
                We encourage you to contact us first to resolve any disputes. If we cannot resolve a dispute through direct communication:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-1">
                <li>Any disputes shall be resolved through binding arbitration</li>
                <li>Arbitration will be conducted by a single arbitrator</li>
                <li>The arbitration will take place in New York, NY</li>
                <li>You waive your right to participate in class action lawsuits</li>
              </ul>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms and Conditions is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Changes to Terms</h2>
              <p className="text-muted-foreground">
                DJK reserves the right to revise these Terms and Conditions at any time without notice. By using this Website, you are agreeing to be bound by the then current version of these Terms and Conditions.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4 text-luxury-gold">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-muted/30 p-6 rounded-lg">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> legal@DJK.com</p>
                <p className="text-muted-foreground mb-2"><strong>Phone:</strong> 1-800-DJK</p>
                <p className="text-muted-foreground mb-2"><strong>Address:</strong> DJK Legal Department</p>
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

export default TermsConditions;
