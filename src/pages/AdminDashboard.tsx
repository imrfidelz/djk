
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { Skeleton } from '@/components/ui/skeleton';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/dashboard/Dashboard';
import ProductManagement from '@/components/admin/product/ProductManagement';
import CategoryManagement from '@/components/admin/category/CategoryManagement';
import BrandManagement from '@/components/admin/brand/BrandManagement';
import BannerManagement from '@/components/admin/banner/BannerManagement';
import ReviewManagement from '@/components/admin/review/ReviewManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import LocationManagement from '@/components/admin/LocationManagement';
import BankManagement from '@/components/admin/bank/BankManagement';
import AdminSettings from '@/components/admin/AdminSettings';

type SidebarTab = 'dashboard' | 'products' | 'settings' | 'subscription' | 'orders' | 'payout' | 'locations' | 'users' | 'categories' | 'brands' | 'reviews' | 'banners' | 'banks';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!authService.isAuthenticated()) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin dashboard.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const user = await authService.getCurrentUser();
        
        if (user.role !== 'admin') {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Admin access check failed:', error);
        toast({
          title: "Authentication failed",
          description: "Please log in to access the admin dashboard.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'brands':
        return <BrandManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'banks':
        return <BankManagement />;
case 'settings':
        return <AdminSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="flex">
          <div className="w-60 bg-white border-r border-[#E0E0E0] min-h-screen">
            <div className="p-4">
              <Skeleton className="h-10 w-32 mb-8" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          <main className="flex-1 p-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm min-h-[140px]">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif]">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 ml-0 md:ml-0">
          <div className="pt-12 md:pt-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
