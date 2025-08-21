import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Edit, Eye, Filter, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { orderService } from '@/services/orderService';
import type { Order } from '@/components/admin/types/order.types';
import { Skeleton } from '@/components/ui/skeleton';
import StatusUpdateDialog from '@/components/admin/order/components/StatusUpdateDialog';
import PaymentUpdateDialog from '@/components/admin/order/components/PaymentUpdateDialog';
import { formatCurrency as formatCurrencyNGN } from '@/lib/currency';
const backendToUiStatus: Record<string, string> = {
  Pending: 'Pending',
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Canceled: 'Canceled',
};

const nextStatusMap: Record<string, string | null> = {
  Pending: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
  Delivered: null,
  Canceled: null,
};

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (activeTab !== 'all') {
      list = list.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());
    }
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((o) => {
      const orderNumber = (o as any).orderNumber || o._id?.slice(-6);
      const customer = o.customerInformation?.name || (o.user as any)?.name || '';
      return (
        orderNumber?.toString().toLowerCase().includes(q) ||
        customer.toLowerCase().includes(q)
      );
    });
  }, [orders, activeTab, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="default">Delivered</Badge>;
      case 'Processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'Shipped':
        return <Badge variant="outline">Shipped</Badge>;
      case 'Canceled':
        return <Badge variant="destructive">Canceled</Badge>;
      case 'Pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const full = await orderService.getById(order._id);
      setSelectedOrder(full);
      setDrawerOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenUpdateDialog = (order: Order) => {
    setOrderToUpdate(order);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdated = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleOpenPaymentDialog = (order: Order) => {
    setOrderToPay(order);
    setPaymentDialogOpen(true);
  };

  const handleMarkedPaid = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    if (selectedOrder && selectedOrder._id === updated._id) {
      setSelectedOrder(updated);
    }
  };
  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : '');
  const formatCurrency = (n?: number) => (typeof n === 'number' ? formatCurrencyNGN(n) : formatCurrencyNGN(0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif">Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search by order number or customer name..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter Orders
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Processing">Processing</TabsTrigger>
          <TabsTrigger value="Shipped">Shipped</TabsTrigger>
          <TabsTrigger value="Delivered">Delivered</TabsTrigger>
          <TabsTrigger value="Canceled">Canceled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map((i)=> (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => {
                      const orderNumber = (order as any).orderNumber || order._id?.slice(-6);
                      const customer = order.customerInformation?.name || (order.user as any)?.name || 'N/A';
                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{orderNumber}</TableCell>
                          <TableCell>{customer}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye size={16} className="mr-1" />
                              View
                            </Button>
                            {!order.isPaid && (
                              <Button size="sm" onClick={() => handleOpenPaymentDialog(order)}>
                                Mark as Paid
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleOpenUpdateDialog(order)}>
                              <Edit size={16} className="mr-1" />
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <ShoppingBag className="mr-2" size={20} />
              Order {(selectedOrder as any)?.orderNumber || selectedOrder?._id?.slice(-6)}
              <Badge className="ml-2">{backendToUiStatus[selectedOrder?.status || 'Pending']}</Badge>
            </DrawerTitle>
          </DrawerHeader>

          {selectedOrder && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <p>{selectedOrder.customerInformation?.name || (selectedOrder.user as any)?.name}</p>
                  <p className="text-muted-foreground">
                    <Clock size={16} className="inline mr-1" />
                    Order Date: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.orderedItems?.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{item.product?.name || item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.quantity * item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-muted-foreground">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-xl font-semibold">{formatCurrency(selectedOrder.totalPrice)}</p>
                </div>
              </div>
            </div>
          )}

          <DrawerFooter>
            {selectedOrder && !selectedOrder.isPaid && (
              <Button onClick={() => handleOpenPaymentDialog(selectedOrder)}>Mark as Paid</Button>
            )}
            {selectedOrder && (
              <Button variant="outline" onClick={() => handleOpenUpdateDialog(selectedOrder)}>Update Order Status</Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <StatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={orderToUpdate}
        onUpdated={(newStatus) => {
          if (orderToUpdate?._id) {
            handleStatusUpdated(orderToUpdate._id, newStatus as Order['status']);
          }
        }}
      />
      <PaymentUpdateDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        order={orderToPay}
        onUpdated={handleMarkedPaid}
      />
    </div>
  );
};

export default OrderManagement;
