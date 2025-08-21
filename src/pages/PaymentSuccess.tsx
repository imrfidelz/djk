
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const txRef = searchParams.get('tx_ref');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            {txRef && (
              <p className="text-sm text-green-800 mb-2">
                <strong>Reference:</strong> {txRef}
              </p>
            )}
            {orderId && (
              <p className="text-sm text-green-800">
                <strong>Order ID:</strong> {orderId}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 text-center">
            You will receive an email confirmation shortly. You'll be redirected to your orders in 10 seconds.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/orders')} className="w-full">
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
