
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, Eye, AlertCircle, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { checkoutService } from "@/services/checkoutService";
import { authService } from "@/services/authService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage?: string;
    images?: string[];
    image?: string; // fallback for compatibility
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
  paymentMethod: string;
  isPaid: boolean;
  orderedItems: OrderItem[];
  customerInformation: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
  shippingAddress?: {
    address: string;
    apartment?: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Canceled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          toast({
            title: "Authentication required",
            description: "Please log in to view your orders.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        setLoading(true);
        setError(null);
        
        const userOrders = await checkoutService.getMyOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        toast({
          title: "Error loading orders",
          description: "Failed to load your orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast, navigate]);
  
  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedItems.some((item) =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Helper function to get product image
  const getProductImage = (product: OrderItem['product']) => {
    return product.mainImage || product.images?.[0] || product.image || '/placeholder.svg';
  };

  // Safely resolve name from string or object { _id, name }
  const resolveName = (val: any) => (typeof val === 'string' ? val : val?.name ?? '');

  // Helper to format a brief shipping summary for header
  const formatShippingSummary = (order: Order) => {
    const city = resolveName(order.shippingAddress?.city);
    const state = resolveName(order.shippingAddress?.state);
    const country = resolveName(order.shippingAddress?.country);
    if (city && state) return `${city}, ${state}`;
    return country || '';
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-serif">My Orders</h1>
              <p className="text-muted-foreground mt-2">Loading your orders...</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-luxury-gold/20">
                  <CardContent className="py-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-serif">My Orders</h1>
            </div>
            <Card className="border-luxury-gold/20">
              <CardContent className="py-10 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Error Loading Orders</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-luxury-gold hover:bg-luxury-gold/90"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | Djk</title>
        <meta name="description" content="Track and manage your djk orders. View order details, items, payment status, and shipping addresses." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/orders'} />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-serif">My Orders</h1>
            <p className="text-muted-foreground mt-2">View and track your purchases</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search orders by ID or product..."
                className="pl-10 border-luxury-gold/30 focus-visible:ring-luxury-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <Card className="border-luxury-gold/20">
              <CardContent className="py-10 text-center">
                {orders.length === 0 ? (
                  <>
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Link to="/">
                      <Button className="bg-luxury-gold hover:bg-luxury-gold/90">
                        Start Shopping
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-muted-foreground">No orders found matching your search.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order._id} className="border-luxury-gold/20 overflow-hidden">
                  <CardHeader className="bg-muted/30 px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <CardTitle className="text-base font-medium">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={`${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </Badge>
                          {order.isPaid && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Paid
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-medium">₦{order.totalPrice.toFixed(2)}</span>
                          {formatShippingSummary(order) && (
                            <span className="text-xs text-muted-foreground">
                              Ship to {formatShippingSummary(order)}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpand(order._id)}
                          className="text-luxury-gold hover:text-luxury-gold/80 hover:bg-luxury-gold/10 p-2"
                        >
                          {expandedOrder === order._id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedOrder === order._id && (
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Customer Information</h4>
                            <p className="text-sm text-muted-foreground">{order.customerInformation.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customerInformation.email}</p>
                            {order.customerInformation.phoneNumber && (
                              <p className="text-sm text-muted-foreground">{order.customerInformation.phoneNumber}</p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Payment Information</h4>
                            <p className="text-sm text-muted-foreground">Method: {order.paymentMethod}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {order.isPaid ? 'Paid' : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            {order.shippingAddress ? (
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  {order.shippingAddress.address}
                                  {order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ""}
                                </p>
                                <p>
                                  {[resolveName(order.shippingAddress.city), resolveName(order.shippingAddress.state)].filter(Boolean).join(", ")}
                                </p>
                                <p>
                                  {resolveName(order.shippingAddress.country)}
                                  {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No shipping address available.</p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <h4 className="font-medium">Order Items</h4>
                        {order.orderedItems.map((item, idx) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && <Separator className="my-4" />}
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                {getProductImage(item.product) !== '/placeholder.svg' ? (
                                  <img
                                    src={getProductImage(item.product)}
                                    alt={`${item.product.name} product image`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Qty: {item.quantity} × ₦{item.price.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  ₦{(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-medium">₦{order.totalPrice.toFixed(2)}</span>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                          <Link to={`/order/${order._id}`}>
                            <Button size="sm" variant="outline" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10">
                              <Eye className="mr-2 h-4 w-4" />
                              View Order Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
