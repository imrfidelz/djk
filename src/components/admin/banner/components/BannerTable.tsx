
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { bannerService } from '@/services/bannerService';
import BannerActions from './BannerActions';

const BannerTable = () => {
  const { data: banners = [], isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load banners: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  // Mobile card view for small screens
  const MobileBannerCard = ({ banner }: { banner: any }) => {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={banner.image}
              alt="Banner"
              className="h-12 w-16 object-cover rounded shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {banner.section === 'hero' ? 'Hero' : 
                   banner.section === 'signature-collection' ? 'Signature Collection' : 
                   'Commitment'}
                </Badge>
                <Badge variant={banner.isHero ? "default" : "secondary"} className="text-xs">
                  {banner.isHero ? 'Hero' : 'Regular'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Order: {banner.order} • Created: {new Date(banner.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <BannerActions banner={banner} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden space-y-3 p-4">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <MobileBannerCard key={banner._id} banner={banner} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No banners found. Add your first banner to get started.</p>
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="hidden lg:table-cell">Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length > 0 ? (
                  banners.map((banner) => (
                    <TableRow key={banner._id}>
                      <TableCell>
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {banner.section === 'hero' ? 'Hero' : 
                           banner.section === 'signature-collection' ? 'Signature Collection' : 
                           'Commitment'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.isHero ? "default" : "secondary"}>
                          {banner.isHero ? 'Hero' : 'Regular'}
                        </Badge>
                      </TableCell>
                      <TableCell>{banner.order}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(banner.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <BannerActions banner={banner} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No banners found. Add your first banner to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerTable;
