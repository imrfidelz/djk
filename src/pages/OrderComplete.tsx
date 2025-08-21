import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, FileText, Printer, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { checkoutService } from '@/services/checkoutService';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';

const OrderComplete = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if coming from Flutterwave callback
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          toast({
            title: "Authentication required",
            description: "Please log in to view order details.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Verify token is valid by trying to get current user
        await authService.getCurrentUser();
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast({
          title: "Authentication required",
          description: "Please log in to view order details.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate, toast]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const loadOrderData = async () => {
      // If we have location state (from direct order placement), use that
      if (location.state?.orderData) {
        setOrderData(location.state.orderData);
        return;
      }

      // If we have tx_ref from Flutterwave, show success message
      if (txRef || transactionId) {
        setOrderData({
          orderId: txRef || transactionId,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          total: 0, // You might want to fetch the actual order details
          paymentMethod: 'FlutterWave',
          items: [],
          billingAddress: {
            name: 'Customer',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phone: '',
            email: '',
          }
        });
        
        toast({
          title: "Payment successful!",
          description: "Your order has been confirmed and is being processed.",
        });
        return;
      }

      // Otherwise, use default mock data
      setOrderData({
        orderId: '1295',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        total: 1799.00,
        paymentMethod: 'FlutterWave',
        items: [
          {
            id: '1',
            name: 'Gold Statement Earrings',
            price: 1799.00,
            quantity: 1,
          }
        ],
        billingAddress: {
          name: 'Emma Johnson',
          address: '123 Fifth Avenue, New York',
          city: 'New York',
          state: 'NY',
          zipCode: '10103',
          country: 'United States',
          phone: '(555) 242-9384',
          email: 'contact@email.com',
        }
      });
    };

    loadOrderData();
  }, [location.state, txRef, transactionId, toast, isCheckingAuth]);

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    toast({
      title: "Feature coming soon",
      description: "Invoice download will be available soon.",
    });
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[60vh]">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48 mx-auto" />
            
            {/* Checkout Steps Skeleton */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="ml-2 h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-96 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center md:text-left">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orderData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[60vh]">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48 mx-auto" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl mb-8">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-500 w-7 h-7 rounded-full flex items-center justify-center text-sm">
              1
            </div>
            <span className="ml-2 mr-4 text-gray-400">SHOPPING CART</span>
          </div>
          <div className="h-px bg-gray-300 w-8"></div>
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-500 w-7 h-7 rounded-full flex items-center justify-center text-sm">
              2
            </div>
            <span className="ml-2 mr-4 text-gray-400">CHECKOUT DETAILS</span>
          </div>
          <div className="h-px bg-gray-300 w-8"></div>
          <div className="flex items-center">
            <div className="bg-luxury-gold text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              3
            </div>
            <span className="ml-2 font-medium text-luxury-gold">ORDER COMPLETE</span>
          </div>
        </div>
        
        {/* Thank You Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="font-serif text-2xl mb-2">Thank you! Your order has been received.</h2>
          <p className="text-gray-500">
            {orderData.paymentMethod === 'FlutterWave' 
              ? 'Your payment has been confirmed and your order is being processed.'
              : 'A confirmation has been sent to your email.'
            }
          </p>
        </div>
        
        {/* Order Summary Box */}
        <div className="bg-gray-50 p-6 rounded-md mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-medium">{orderData.orderId}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-medium">{orderData.date}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="font-medium">{formatCurrency(orderData.total)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">Payment method</p>
              <p className="font-medium">{orderData.paymentMethod}</p>
            </div>
          </div>
        </div>
        
        <h2 className="font-serif text-xl mb-4">ORDER DETAILS</h2>
        
        {/* Order Items */}
        <div className="mb-8">
          <div className="flex justify-between py-4 border-b border-gray-100 text-gray-500 text-sm">
            <div>Product</div>
            <div>Total</div>
          </div>
          
          {orderData.items && orderData.items.length > 0 ? (
            orderData.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-4 border-b border-gray-100">
                <div>
                  {item.name} × {item.quantity}
                </div>
                <div className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 border-b border-gray-100 text-gray-500">
              Order items will be displayed here once available
            </div>
          )}
          
          <div className="flex justify-between py-4 border-b border-gray-100">
            <div>Subtotal</div>
            <div className="font-medium">
              {formatCurrency(orderData.total)}
            </div>
          </div>
          
          <div className="flex justify-between py-4 border-b border-gray-100">
            <div>Payment method</div>
            <div>{orderData.paymentMethod}</div>
          </div>
          
          <div className="flex justify-between py-4 font-medium">
            <div>Total</div>
            <div className="text-lg">{formatCurrency(orderData.total)}</div>
          </div>
        </div>
        
        {/* Billing Address */}
        {orderData.billingAddress && (
          <div className="mb-10">
            <h2 className="font-serif text-xl mb-4">BILLING ADDRESS</h2>
            <div className="text-gray-600">
              <p className="mb-1">{orderData.billingAddress.name}</p>
              <p className="mb-1">{orderData.billingAddress.address}</p>
              <p className="mb-1">{orderData.billingAddress.city}, {orderData.billingAddress.state} {orderData.billingAddress.zipCode}</p>
              <p className="mb-1">{orderData.billingAddress.country}</p>
              <p className="mb-1">{orderData.billingAddress.phone}</p>
              <p>{orderData.billingAddress.email}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrintOrder}>
            <Printer size={16} />
            Print Order
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadInvoice}>
            <FileText size={16} />
            Download Invoice
          </Button>
          <Link to="/">
            <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default OrderComplete;
