import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Package, DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import StatusUpdateDialog from './components/StatusUpdateDialog';
import PaymentUpdateDialog from './components/PaymentUpdateDialog';
import { orderService } from '@/services/orderService';
import { Order } from '../types/order.types';
import { formatCurrency } from '@/lib/currency';

const OrderManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll,
  });

  // Update order status mutation with optimistic updates
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData<Order[]>(['orders']);
      
      queryClient.setQueryData<Order[]>(['orders'], old =>
        (old || []).map(order =>
          order._id === id ? { ...order, status: status as Order['status'] } : order
        )
      );
      
      return { previousOrders };
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
      setIsStatusDialogOpen(false);
      setSelectedOrder(null);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Update payment status mutation with optimistic updates
  const updatePaymentMutation = useMutation({
    mutationFn: orderService.markAsPaid,
    onMutate: async (orderId: string) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData<Order[]>(['orders']);
      
      queryClient.setQueryData<Order[]>(['orders'], old =>
        (old || []).map(order =>
          order._id === orderId ? { ...order, paymentMethod: 'FlutterWave' as Order['paymentMethod'] } : order
        )
      );
      
      return { previousOrders };
    },
    onSuccess: () => {
      toast({
        title: "Payment Updated",
        description: "Payment status has been updated successfully.",
      });
      setIsPaymentDialogOpen(false);
      setSelectedOrder(null);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleStatusUpdate = (newStatus: string) => {
    if (selectedOrder) {
      updateStatusMutation.mutate({
        id: selectedOrder._id,
        status: newStatus,
      });
    }
  };

  const handlePaymentUpdate = () => {
    if (selectedOrder) {
      updatePaymentMutation.mutate(selectedOrder._id);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Processing': return 'default';
      case 'Shipped': return 'default';
      case 'Delivered': return 'default';
      case 'Canceled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentBadgeVariant = (method: string) => {
    switch (method) {
      case 'FlutterWave': return 'default';
      case 'Cash On Delivery': return 'secondary';
      case 'Bank Transfer': return 'secondary';
      default: return 'secondary';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof order.user === 'object' && order.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
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

  const orderStats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Pending').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    totalRevenue: orders
      .filter(order => order.paymentMethod === 'FlutterWave')
      .reduce((sum, order) => sum + order.totalPrice, 0),
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Order Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage customer orders and track fulfillment
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(orderStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total paid orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile view */}
          <div className="md:hidden space-y-3 p-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>No orders found matching your criteria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono text-sm font-medium">
                        #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm font-medium mt-1">
                        {typeof order.user === 'object' ? order.user.name : 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {typeof order.user === 'object' ? order.user.email : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(order.totalPrice)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                    <Badge variant={getPaymentBadgeVariant(order.paymentMethod)} className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsStatusDialogOpen(true);
                      }}
                      className="w-full text-xs h-8"
                    >
                      Update Status
                    </Button>
                    {order.paymentMethod !== 'FlutterWave' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsPaymentDialogOpen(true);
                        }}
                        className="w-full text-xs h-8"
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No orders found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order._id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          #{order._id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {typeof order.user === 'object' ? order.user.name : 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {typeof order.user === 'object' ? order.user.email : ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentBadgeVariant(order.paymentMethod)}>
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsStatusDialogOpen(true);
                              }}
                            >
                              Update Status
                            </Button>
                            {order.paymentMethod !== 'FlutterWave' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsPaymentDialogOpen(true);
                                }}
                              >
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      {selectedOrder && (
        <StatusUpdateDialog
          open={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          order={selectedOrder}
          onUpdated={handleStatusUpdate}
        />
      )}

      {/* Payment Update Dialog */}
      {selectedOrder && (
        <PaymentUpdateDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          order={selectedOrder}
          onUpdated={handlePaymentUpdate}
        />
      )}
    </div>
  );
};

export default OrderManagement;