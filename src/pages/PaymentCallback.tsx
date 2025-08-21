import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/services/config';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const transactionId = searchParams.get('transaction_id');
      const txRef = searchParams.get('tx_ref');
      const paymentStatus = searchParams.get('status');

      console.log('Payment callback params:', { transactionId, txRef, paymentStatus });

      // Validate required parameters
      if (!transactionId || !txRef) {
        console.error('Missing required parameters');
        setStatus('failed');
        setMessage('Invalid payment callback parameters.');
        toast({
          title: 'Payment Error',
          description: 'Invalid payment callback parameters.',
          variant: 'destructive',
        });
        return;
      }

      // Handle cancelled payments immediately
      if (paymentStatus === 'cancelled') {
        setStatus('failed');
        setMessage('Payment was cancelled.');
        toast({
          title: 'Payment Cancelled',
          description: 'Your payment was cancelled.',
          variant: 'destructive',
        });
        return;
      }

      // For completed/successful payments, call backend for verification
      if (paymentStatus === 'completed' || paymentStatus === 'successful') {
        try {
          console.log('Calling backend for verification...');
          
          // Make a request to backend callback endpoint for verification (no auth required)
          const response = await fetch(`${API_BASE_URL}/orders/callback?transaction_id=${transactionId}&tx_ref=${txRef}&status=${paymentStatus}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Backend response status:', response.status);
          console.log('Backend response redirected:', response.redirected);
          console.log('Backend response URL:', response.url);

          // Check if backend redirected us
          if (response.redirected) {
            const redirectUrl = response.url;
            console.log('Backend redirected to:', redirectUrl);
            
            if (redirectUrl.includes('/payment-success')) {
              const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
              const orderId = urlParams.get('order_id');
              navigate(`/payment-success?tx_ref=${txRef}&order_id=${orderId || ''}`);
            } else if (redirectUrl.includes('/payment-failed')) {
              const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
              const reason = urlParams.get('reason');
              navigate(`/payment-failed?tx_ref=${txRef}&reason=${reason || 'verification_failed'}`);
            }
            return;
          }

          // If no redirect, check response status
          if (response.ok) {
            console.log('Payment verification successful');
            navigate(`/payment-success?tx_ref=${txRef}`);
          } else {
            console.error('Payment verification failed with status:', response.status);
            const errorData = await response.text();
            console.error('Error response:', errorData);
            navigate(`/payment-failed?tx_ref=${txRef}&reason=verification_failed`);
          }

        } catch (error) {
          console.error('Payment verification error:', error);
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
          toast({
            title: 'Payment Verification Failed',
            description: 'There was an issue verifying your payment. Please contact support.',
            variant: 'destructive',
          });
        }
      } else {
        // Unknown status
        console.error('Unknown payment status:', paymentStatus);
        setStatus('failed');
        setMessage('Unknown payment status received.');
        toast({
          title: 'Payment Error',
          description: 'Unknown payment status received.',
          variant: 'destructive',
        });
      }
    };

    // Add a small delay to ensure proper parameter processing
    const timer = setTimeout(handlePaymentCallback, 1000);
    return () => clearTimeout(timer);
  }, [searchParams, toast, navigate]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <CardTitle>Processing Payment</CardTitle>
            <CardDescription>
              Please wait while we verify your payment...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <CardTitle className="text-red-600">Payment Processing Failed</CardTitle>
            <CardDescription>
              {message || 'Your payment could not be processed. Please try again or contact support.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button onClick={handleTryAgain} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This should not be reached as we navigate away for success cases
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/orders')} className="w-full">
              View My Orders
            </Button>
            <Button variant="outline" onClick={handleContinueShopping} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
