import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService } from '@/services/dashboardService';
import CircularProgress from './CircularProgress';
import RecentOrdersTable from './RecentOrdersTable';
import { formatCurrency } from '@/lib/currency';

const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    retry: 1,
    refetchInterval: 30000,
  });

  if (statsLoading) {
    return (
      <div className="space-y-4">
        {/* Loading state for metric cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-3 sm:p-4 md:p-6 min-h-[100px] sm:min-h-[140px] md:min-h-[180px]">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-1 sm:space-y-2 md:space-y-3">
                  <Skeleton className="h-3 w-14 sm:w-16 md:w-20" />
                  <Skeleton className="h-6 w-16 sm:w-20 md:w-24" />
                  <Skeleton className="h-2 w-10 sm:w-12 md:w-16" />
                </div>
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 rounded-full" />
              </div>
            </Card>
          ))}
        </div>

        {/* Loading state for recent orders */}
        <Card className="bg-white rounded-xl shadow-sm border border-[#E0E0E0]">
          <CardHeader className="pb-2 sm:pb-4">
            <Skeleton className="h-5 w-20 sm:w-24 md:w-32" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6">
            <Skeleton className="h-32 sm:h-40 md:h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-6 px-3 sm:px-4">
        <p className="text-[#F44336] mb-2 sm:mb-3 md:mb-4 font-medium text-sm sm:text-base">
          Failed to load dashboard data: {statsError?.message}
        </p>
        <p className="text-[#9E9E9E] text-xs sm:text-sm">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  const defaultStats = { totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0 };
  const displayStats = stats || defaultStats;

  const maxRevenue = 100000;
  const salesPercentage = Math.min(Math.round((displayStats.totalRevenue / maxRevenue) * 100), 100);
  const usersPercentage = Math.min(Math.round((displayStats.totalUsers / 10000) * 100), 100);

  const metricsData = [
    { title: "Total Products", value: displayStats.totalProducts, icon: Package, color: "#4CAF50", percentage: Math.min(Math.round((displayStats.totalProducts / 1000) * 100), 100), period: "+12% from last month" },
    { title: "Total Orders", value: displayStats.totalOrders, icon: ShoppingCart, color: "#2196F3", percentage: Math.min(Math.round((displayStats.totalOrders / 500) * 100), 100), period: "+8% from last month" },
    { title: "Total Revenue", value: formatCurrency(displayStats.totalRevenue), icon: DollarSign, color: "#9C27B0", percentage: salesPercentage, period: "+15% from last month" },
    { title: "Total Users", value: displayStats.totalUsers, icon: Users, color: "#FF9800", percentage: usersPercentage, period: "+5% from last month" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {metricsData.map((metric, index) => (
          <Card key={index} className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-3 sm:p-4 md:p-6 min-h-[100px] sm:min-h-[140px] md:min-h-[180px]">
            <CardContent className="p-0 h-full">
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between h-full gap-2">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <metric.icon size={14} className="sm:size-4 md:size-[16px]" color={metric.color} strokeWidth={2} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium text-[#424242]">{metric.title}</h3>
                  </div>
                  <p className="text-base sm:text-lg md:text-2xl font-bold text-[#212121]">{metric.value}</p>
                  <p className="text-[10px] sm:text-xs text-[#9E9E9E]">{metric.period}</p>
                </div>
                <div className="block sm:block">
                  <CircularProgress 
                    percentage={metric.percentage}
                    color={metric.color}
                    size={50}
                    strokeWidth={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="overflow-x-auto">
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default DashboardOverview;
