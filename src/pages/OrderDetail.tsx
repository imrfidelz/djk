
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Truck, Home, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { API_BASE_URL } from '@/services/config';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getIconForStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return <Package className="h-5 w-5 text-luxury-gold" />;
    case "Shipped":
      return <Truck className="h-5 w-5 text-luxury-gold" />;
    case "Delivered":
      return <Home className="h-5 w-5 text-luxury-gold" />;
    default:
      return <CalendarDays className="h-5 w-5 text-luxury-gold" />;
  }
};

const fetchOrderById = async (orderId: string) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  const data = await response.json();
  return data.order;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif mb-4">Order not found</h1>
          <p className="mb-6">The order you are looking for does not exist or you don't have permission to view it.</p>
          <Link to="/orders">
            <Button className="bg-luxury-gold hover:bg-luxury-gold/90">Return to Orders</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Create a simple timeline based on order status
  const getOrderTimeline = (order: any) => {
    const timeline = [
      { 
        date: order.createdAt, 
        status: "Order Placed", 
        description: "Your order has been received" 
      },
    ];

    if (order.isPaid) {
      timeline.push({
        date: order.paidAt || order.createdAt,
        status: "Payment Confirmed",
        description: "Payment has been confirmed"
      });
    }

    if (order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered') {
      timeline.push({
        date: order.updatedAt,
        status: "Processing",
        description: "Your order is being prepared"
      });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      timeline.push({
        date: order.updatedAt,
        status: "Shipped",
        description: "Your order has been shipped"
      });
    }

    if (order.status === 'Delivered') {
      timeline.push({
        date: order.deliveredAt || order.updatedAt,
        status: "Delivered",
        description: "Package delivered successfully"
      });
    }

    return timeline;
  };

  const timeline = getOrderTimeline(order);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif">Order #{order._id.slice(-6).toUpperCase()}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Badge variant="outline" className={`${getStatusColor(order.status)} capitalize px-3 py-1 text-sm`}>
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Order Summary Card */}
            <div className="lg:col-span-2">
              <Card className="border-luxury-gold/20">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right w-[80px]">Qty</TableHead>
                        <TableHead className="text-right w-[100px]">Price</TableHead>
                        <TableHead className="text-right w-[100px]">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderedItems?.map((item: any, index: number) => (
                        <TableRow key={item._id || index}>
                          <TableCell className="align-middle">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                              {item.product?.mainImage || item.product?.images?.[0] ? (
                                <img
                                  src={item.product.mainImage || item.product.images[0]}
                                  alt={item.product?.name || 'Product'}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>{item.product?.name || 'Product'}</div>
                            {(item.size || item.color) && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.size && item.color && <span> • </span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₦{item.price?.toFixed(2)}</TableCell>
                          <TableCell className="text-right">₦{(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₦{(order.totalPrice - order.shippingPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>₦{order.shippingPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₦{order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card className="border-luxury-gold/20 mt-8">
                <CardHeader>
                  <CardTitle className="text-xl">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {timeline.map((event, index) => (
                      <div key={index} className="mb-8 last:mb-0 flex">
                        <div className="mr-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold/10 ring-8 ring-white">
                            {getIconForStatus(event.status)}
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="h-full w-0.5 bg-luxury-gold/20 mx-auto mt-3" style={{ height: '30px' }}></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                            <h3 className="text-lg font-medium">{event.status}</h3>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Info */}
            <div className="space-y-8">
              <Card className="border-luxury-gold/20">
                <CardHeader>
                  <CardTitle className="text-xl">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.customerInformation?.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customerInformation?.email}</p>
                    {order.customerInformation?.phoneNumber && (
                      <p className="text-sm text-muted-foreground">{order.customerInformation.phoneNumber}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-luxury-gold/20">
                <CardHeader>
                  <CardTitle className="text-xl">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.shippingAddress?.address}</p>
                    {order.shippingAddress?.apartment && (
                      <p>{order.shippingAddress.apartment}</p>
                    )}
                    <p>
                      {order.shippingAddress?.city?.name || order.shippingAddress?.city}, {order.shippingAddress?.state?.name || order.shippingAddress?.state}
                    </p>
                    <p>{order.shippingAddress?.country?.name || order.shippingAddress?.country}</p>
                    <p>{order.shippingAddress?.postalCode}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-luxury-gold/20">
                <CardHeader>
                  <CardTitle className="text-xl">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                    <p><span className="font-medium">Status:</span> {order.isPaid ? 'Paid' : 'Pending'}</p>
                    {order.paidAt && (
                      <p className="text-sm text-muted-foreground">
                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col space-y-4 pt-4">
                <Link to="/track-order">
                  <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90">
                    Track This Order
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="outline" className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10">
                    Back to Orders
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
