
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Settings, CreditCard, ShoppingBag, DollarSign, MapPin, Users, FolderTree, BadgeCheck, Star, Menu, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type SidebarTab = 'dashboard' | 'products' | 'settings' | 'subscription' | 'orders' | 'payout' | 'locations' | 'users' | 'categories' | 'brands' | 'reviews' | 'banners' | 'banks';

interface AdminSidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

interface SidebarItem {
  id: SidebarTab;
  label: string;
  icon: React.ElementType;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Product', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'brands', label: 'Brands', icon: BadgeCheck },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'orders', label: 'Order', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'locations', label: 'Location', icon: MapPin },
    { id: 'banks', label: 'Banks', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="p-4 h-full">
      {/* Logo */}
      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold text-[#212121]">EGATOR</h2>
        <p className="text-xs text-[#9E9E9E] font-medium">Admin Dashboard</p>
      </div>
      
      {/* Navigation Items */}
      <div className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 font-medium",
              activeTab === item.id 
                ? "bg-[#FCE4EC] text-[#FF4081]" 
                : "text-[#757575] hover:bg-[#F5F5F5] hover:text-[#424242]"
            )}
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar trigger */}
      <div className="md:hidden fixed top-[80px] left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(true)} 
          className="bg-white shadow-md border-[#E0E0E0] rounded-lg"
        >
          <Menu size={20} />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-60 p-0 bg-white border-r border-[#E0E0E0]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="w-60 min-h-screen bg-white border-r border-[#E0E0E0] hidden md:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
