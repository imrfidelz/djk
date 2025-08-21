import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { orderService } from '@/services/orderService';

const RecentOrdersTable: React.FC = () => {
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => orderService.getAll(),
    retry: 1,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      case 'canceled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getPaymentStatus = (isPaid: boolean, paymentMethod: string) => {
    if (isPaid) return 'Paid';
    if (paymentMethod === 'Cash On Delivery') return 'COD';
    return 'Due';
  };

  const NoOrdersIllustration = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg
        width="200"
        height="160"
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        <path
          d="M50 60L30 80V140H170V80L150 60H50Z"
          fill="#F5F5F5"
          stroke="#E0E0E0"
          strokeWidth="2"
        />
        <path
          d="M30 80L50 60H150L170 80"
          stroke="#E0E0E0"
          strokeWidth="2"
        />
        <path
          d="M80 80V50C80 46.6863 82.6863 44 86 44H114C117.314 44 120 46.6863 120 50V80"
          stroke="#BDBDBD"
          strokeWidth="2"
        />
        <circle cx="70" cy="110" r="10" fill="#E0E0E0" />
        <circle cx="130" cy="110" r="10" fill="#E0E0E0" />
        <path
          d="M70 100V70C70 66.6863 72.6863 64 76 64H124C127.314 64 130 66.6863 130 70V100"
          stroke="#BDBDBD"
          strokeWidth="2"
        />
      </svg>
      <h3 className="text-lg font-medium text-[#757575] mb-2">No Orders Yet</h3>
      <p className="text-sm text-[#BDBDBD] max-w-xs">
        Your recent orders will appear here once you start shopping.
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
                <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Order Number</TableHead>
                <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Payment</TableHead>
                <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Status</TableHead>
                <TableHead className="text-sm font-medium text-[#757575] py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-b border-[#E0E0E0]">
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const orders = ordersData || [];
  const hasOrders = orders.length > 0;

  if (!hasOrders) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NoOrdersIllustration />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Order Number</TableHead>
              <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Payment</TableHead>
              <TableHead className="text-sm font-medium text-[#757575] py-4 px-6">Status</TableHead>
              <TableHead className="text-sm font-medium text-[#757575] py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.slice(0, 7).map((order: any) => (
              <TableRow key={order._id} className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA] transition-colors duration-150">
                <TableCell className="text-[#757575] py-4 px-6">
                  {order.orderNumber || `ORD-${order._id?.slice(-6)?.toUpperCase()}`}
                </TableCell>
                <TableCell className="text-[#757575] py-4 px-6">
                  {getPaymentStatus(order.isPaid, order.paymentMethod)}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status || 'Pending'}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-[#2196F3] hover:text-[#1976D2] hover:bg-[#E3F2FD] text-sm font-medium"
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && (
          <div className="p-6 text-center text-[#F44336]">
            Failed to load recent orders. Showing sample data.
          </div>
        )}
        <div className="p-6 border-t border-[#E0E0E0] text-center">
          <Button 
            variant="ghost"
            className="text-[#2196F3] hover:text-[#1976D2] hover:bg-[#E3F2FD] text-sm font-medium"
          >
            Show All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;
