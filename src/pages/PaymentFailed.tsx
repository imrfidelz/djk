
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const txRef = searchParams.get('tx_ref');
  const reason = searchParams.get('reason');

  const getFailureMessage = () => {
    switch (reason) {
      case 'payment_failed':
        return 'Your payment was declined or could not be processed.';
      case 'verification_failed':
        return 'We could not verify your payment with the payment provider.';
      default:
        return 'Unfortunately, your payment could not be processed at this time.';
    }
  };

  const getFailureTitle = () => {
    switch (reason) {
      case 'verification_failed':
        return 'Payment Verification Failed';
      default:
        return 'Payment Failed';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <CardTitle className="text-red-600">{getFailureTitle()}</CardTitle>
          <CardDescription>
            {getFailureMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {txRef && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Reference:</strong> {txRef}
              </p>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">What can you do?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your payment details and try again</li>
              <li>• Ensure sufficient funds in your account</li>
              <li>• Contact your bank if the issue persists</li>
              <li>• Choose a different payment method</li>
              {reason === 'verification_failed' && (
                <li>• Contact our support team for assistance</li>
              )}
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/checkout')} className="w-full">
              Try Payment Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/cart')} className="w-full">
              Return to Cart
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
