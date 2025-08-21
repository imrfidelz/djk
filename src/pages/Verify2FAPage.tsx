import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Shield, ArrowLeft, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Verify2FAPage = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Get email and tempToken from location state
  const email = location.state && location.state.email ? location.state.email : '';
  const tempTokenFromState = location.state && location.state.tempToken ? location.state.tempToken : '';
  const tempTokenStored = typeof window !== 'undefined' ? localStorage.getItem('tempToken') || '' : '';
  const effectiveTempToken = tempTokenFromState || tempTokenStored;

  useEffect(() => {
    // Require email and a temp token (from state or localStorage); redirect if missing
    if (!email || !effectiveTempToken) {
      toast({
        title: 'Access denied',
        description: 'Invalid or expired session. Please login again.',
        variant: 'destructive',
      });
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line
  }, [email, effectiveTempToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      toast({
        title: 'Error',
        description: 'Missing 2FA code or email. Please login again.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await auth.verify2FA(email, token, effectiveTempToken);
      toast({
        title: 'Login successful',
        description: 'You have been authenticated!',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: '2FA Verification Failed',
        description: error?.message || error?.response?.data?.message || 'Invalid or expired 2FA code.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hide form if access denied (redirect is instant)
  if (!email || !effectiveTempToken) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Verify 2FA - DJK Secure Login</title>
        <meta name="description" content="Securely verify your two-factor authentication (2FA) code to access your DJK account." />
        <link rel="canonical" href="/verify-2fa" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-muted to-background flex flex-col items-center justify-center p-4">
        <main className="w-full max-w-md relative z-10">
          <header className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="sr-only">Two-Factor Authentication</h1>
          </header>

          <Card className="shadow-xl border border-border/60 bg-card/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Enter the 6-digit code from your authenticator app to complete your login
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Minimal step indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Account</span>
                <span>•</span>
                <span className="font-medium text-foreground">Verify 2FA</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="token" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Authentication Code</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="token"
                      type="text"
                      placeholder="000000"
                      className="pl-10 h-12 text-center text-lg font-mono tracking-widest"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={isLoading}
                      inputMode="numeric"
                      autoFocus
                      maxLength={6}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>Enter the 6-digit code from your authenticator app</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading || token.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/70 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Security Note */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Secure Authentication
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This extra layer of security helps protect your account from unauthorized access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Having trouble? Contact support or try logging in again.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              Protected by end-to-end encryption
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Verify2FAPage;
