
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BannerTable from './components/BannerTable';
import AddBannerButton from './components/AddBannerButton';
import { Skeleton } from '@/components/ui/skeleton';
import { bannerService } from '@/services/bannerService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, Image } from 'lucide-react';

const BannerManagement = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="w-full md:w-auto">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Banner Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Manage website banners and hero images</p>
        </div>
        <div className="shrink-0">
          <AddBannerButton />
        </div>
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Banners</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners.filter(banner => banner.isHero).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Homepage heroes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Section Banners</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners.filter(banner => !banner.isHero).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Other sections
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <BannerTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerManagement;
