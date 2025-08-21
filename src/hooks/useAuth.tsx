import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, User } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verify2FA: (email: string, token: string, tempToken?: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const fetchUser = async () => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        clearAuthData();
        setIsLoading(false);
        return;
      }

      console.log('Fetching user data...');
      const userData = await authService.getCurrentUser();
      console.log('User data fetched:', userData);
      setUser(userData);

      // Cache user id for faster cart ops
      const uid = (userData as any)?.id || (userData as any)?._id;
      if (uid) localStorage.setItem('userId', uid);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      clearAuthData();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      clearAuthData();
    }
  };

  const refreshUser = async () => {
    console.log('Refreshing user data...');
    setIsLoading(true);
    await fetchUser();
  };

const verify2FA = async (email: string, token: string, tempToken?: string) => {
  try {
    // Prefer provided tempToken, fallback to stored one
    if (tempToken) {
      localStorage.setItem('tempToken', tempToken);
    }
    const result = await authService.verifyTwoFactorAuth(token, email);
    if (result?.success) {
      toast({
        title: "2FA Verified",
        description: "You have successfully verified your account.",
      });
      await refreshUser();
    } else {
      toast({
        title: "Verification Failed",
        description: result?.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    }
    return result;
  } catch (error) {
    console.error("2FA verification error:", error);
    toast({
      title: "Error",
      description: (error as any)?.message || "An unexpected error occurred.",
      variant: "destructive",
    });
    throw error;
  } finally {
    // Clear any temp token left
    localStorage.removeItem('tempToken');
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for storage changes to handle login/logout in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (e.newValue) {
          refreshUser(); // Token added → refresh user
        } else {
          setUser(null); // Token removed → clear user
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      logout,
      refreshUser,
      verify2FA,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
