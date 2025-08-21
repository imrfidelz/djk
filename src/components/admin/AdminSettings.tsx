import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeCheck, Shield, ShieldOff } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [isLoadingSetup, setIsLoadingSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [otpEnable, setOtpEnable] = useState('');
  const [otpDisable, setOtpDisable] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const handleStartSetup = async () => {
    try {
      setIsLoadingSetup(true);
      const res = await authService.setupTwoFactorAuth();
      setQrCodeUrl(res.qrCodeUrl);
      toast({ title: '2FA setup started', description: 'Scan the QR code with your authenticator app and enter the 6-digit code to enable.' });
    } catch (e: any) {
      toast({ title: 'Failed to start 2FA', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoadingSetup(false);
    }
  };

  const handleVerifyEnable = async () => {
    if (!otpEnable || otpEnable.length < 6 || !user?.email) return;
    try {
      setIsVerifying(true);
      await authService.verifyTwoFactorAuth(otpEnable, user.email);
      setQrCodeUrl('');
      setOtpEnable('');
      await refreshUser();
      toast({ title: '2FA enabled', description: 'Two-factor authentication has been enabled for your account.' });
    } catch (e: any) {
      toast({ title: 'Invalid code', description: e.message, variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable = async () => {
    if (!otpDisable || otpDisable.length < 6) return;
    try {
      setIsDisabling(true);
      await authService.disableTwoFactorAuth(otpDisable);
      setOtpDisable('');
      await refreshUser();
      toast({ title: '2FA disabled', description: 'Two-factor authentication has been disabled.' });
    } catch (e: any) {
      toast({ title: 'Failed to disable', description: e.message, variant: 'destructive' });
    } finally {
      setIsDisabling(false);
    }
  };

  const isEnabled = !!user?.isTwoFactorEnabled;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Settings - 2FA Security</title>
        <meta name="description" content="Manage admin two-factor authentication (2FA) settings for enhanced account security." />
        <link rel="canonical" href="/admin" />
      </Helmet>

      <header className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Security and account controls</p>
      </header>

      <section>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication (2FA)
            </CardTitle>
            <CardDescription>Protect your admin account with an extra layer of security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {isEnabled ? '2FA is currently enabled on your account.' : '2FA is currently disabled on your account.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEnabled ? (
                  <span className="inline-flex items-center gap-1 text-sm"><BadgeCheck className="h-4 w-4" /> Enabled</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm"><ShieldOff className="h-4 w-4" /> Disabled</span>
                )}
              </div>
            </div>

            {!isEnabled && !qrCodeUrl && (
              <div className="flex justify-start">
                <Button onClick={handleStartSetup} disabled={isLoadingSetup}>
                  {isLoadingSetup ? 'Starting…' : 'Enable 2FA'}
                </Button>
              </div>
            )}

            {!isEnabled && qrCodeUrl && (
              <div className="grid gap-6 md:grid-cols-[240px,1fr]">
                <div className="rounded-lg border p-4 bg-background">
                  {/* QR code image */}
                  <img src={qrCodeUrl} alt="2FA QR code for authenticator app" className="w-full h-auto" loading="lazy" />
                </div>
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>Scan the QR code</AlertTitle>
                    <AlertDescription>
                      Open your authenticator app (Google Authenticator, Authy, etc.), add a new account, and scan the QR. Then enter the 6-digit code below.
                    </AlertDescription>
                  </Alert>
                  <div className="grid gap-2 max-w-sm">
                    <Label htmlFor="otp">6-digit code</Label>
                    <Input id="otp" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="••••••" value={otpEnable} onChange={(e) => setOtpEnable(e.target.value.replace(/\D/g, ''))} />
                    <div className="flex gap-2">
                      <Button onClick={handleVerifyEnable} disabled={isVerifying || otpEnable.length < 6}>
                        {isVerifying ? 'Verifying…' : 'Verify & Enable'}
                      </Button>
                      <Button variant="outline" onClick={() => { setQrCodeUrl(''); setOtpEnable(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEnabled && (
              <div className="space-y-3">
                <Alert>
                  <AlertTitle>Disable 2FA</AlertTitle>
                  <AlertDescription>To disable 2FA, enter a current 6-digit code from your authenticator app.</AlertDescription>
                </Alert>
                <div className="grid gap-2 max-w-sm">
                  <Label htmlFor="otpDisable">6-digit code</Label>
                  <Input id="otpDisable" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="••••••" value={otpDisable} onChange={(e) => setOtpDisable(e.target.value.replace(/\D/g, ''))} />
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDisable} disabled={isDisabling || otpDisable.length < 6}>
                      {isDisabling ? 'Disabling…' : 'Disable 2FA'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminSettings;