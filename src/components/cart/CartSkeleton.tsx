import { Skeleton } from '@/components/ui/skeleton';

export const CartSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-24 mb-8" />
      
      {/* Checkout Steps Skeleton */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="ml-2 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};