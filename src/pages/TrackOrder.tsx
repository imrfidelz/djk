import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Package, Truck, Home, CalendarDays, Search } from "lucide-react";
import { orderService } from "@/services/orderService";

// Types for tracking data built from real orders
interface TrackingItem { name: string; image: string }
interface TrackingEvent { date: string; status: string; description: string; icon: any }
interface TrackingData {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  status: string;
  items: TrackingItem[];
  timeline: TrackingEvent[];
}

// Build tracking view model from an order response
const mapOrderToTracking = (order: any): TrackingData => {
  const createdAt = order.createdAt || new Date().toISOString();
  const paidAt = order.paidAt || createdAt;
  const deliveredAt = order.deliveredAt;
  const status = (order.status || 'Pending').toLowerCase();

  const items: TrackingItem[] = (order.orderedItems || []).map((item: any) => ({
    name: item.product?.name || 'Item',
    image: item.product?.mainImage || item.product?.images?.[0] || '/placeholder.svg',
  }));

  const id = order.orderNumber || `ORD-${String(order._id || '').toString().slice(-6).toUpperCase()}`;
  const trackingNumber = order.tx_ref || String(order._id || '').toString().slice(-8).toUpperCase();

  const est = deliveredAt ? new Date(deliveredAt) : new Date(createdAt);
  if (!deliveredAt) est.setDate(est.getDate() + 5);
  const estimatedDelivery = deliveredAt
    ? `Delivered on ${new Date(deliveredAt).toLocaleDateString()}`
    : `Expected by ${est.toLocaleDateString()}`;

  const timeline: TrackingEvent[] = [
    { date: createdAt, status: 'Order Placed', description: 'Your order has been received', icon: Package },
  ];
  if (order.isPaid || paidAt) {
    timeline.push({ date: paidAt, status: 'Processing', description: 'Payment confirmed, preparing your order', icon: Package });
  }
  if (['shipped', 'delivered'].includes(status)) {
    timeline.push({ date: order.shippedAt || paidAt, status: 'Shipped', description: 'Package in transit with carrier', icon: Truck });
  }
  if (status === 'delivered') {
    timeline.push({ date: deliveredAt || est.toISOString(), status: 'Delivered', description: 'Package delivered to recipient', icon: Home });
  }

  return {
    id,
    orderId: String(order._id || ''),
    carrier: 'Premium Logistics',
    trackingNumber,
    estimatedDelivery,
    status,
    items,
    timeline,
  };
};


const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-luxury-gold/20 text-luxury-gold border-luxury-gold/30";
    case "shipped":
    case "in transit":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleTrackOrder = async () => {
    const input = orderId.trim();
    if (!input) {
      toast({ title: "Error", description: "Please enter an order ID", variant: "destructive" });
      return;
    }

    setSearched(true);

    try {
      let order: any | null = null;
      // If user entered human-friendly order number like ORD-XXXXXX
      if (/^ORD-/i.test(input)) {
        try {
          const myOrders = await orderService.getMine();
          order =
            myOrders.find(
              (o: any) => (o as any).orderNumber?.toUpperCase() === input.toUpperCase()
            ) || null;

          if (!order) {
            setTracking(null);
            toast({
              title: "Order not found",
              description: "No order with that number was found in your account.",
              variant: "destructive",
            });
            return;
          }
        } catch (authErr: any) {
          console.warn("TrackOrder: getMine failed", authErr);
          setTracking(null);
          toast({
            title: "Sign in required",
            description:
              "Please log in to search by order number, or paste the 24‑character Order ID.",
            variant: "destructive",
          });
          return;
        }
      } else if (/^[a-fA-F0-9]{24}$/.test(input)) {
        // If user pasted the MongoDB ObjectId
        order = await orderService.getById(input);
      }

      if (!order) {
        setTracking(null);
        toast({
          title: "Order not found",
          description: "We couldn't find tracking for that ID.",
          variant: "destructive",
        });
        return;
      }

      setTracking(mapOrderToTracking(order.order ?? order));
    } catch (err: any) {
      console.error("Track order error:", err);
      setTracking(null);
      toast({ title: "Error", description: err.message || "Failed to fetch order", variant: "destructive" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-serif mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order ID to get the latest status and tracking information</p>
          </div>

          <Card className="border-luxury-gold/20 mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Enter your order ID (e.g., ORD-12345)"
                  className="flex-1 border-luxury-gold/30 focus-visible:ring-luxury-gold"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
                <Button 
                  className="bg-luxury-gold hover:bg-luxury-gold/90 flex gap-2"
                  onClick={handleTrackOrder}
                >
                  <Search className="h-4 w-4" />
                  Track Order
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Enter your order number (e.g., ORD-ABC123) or paste the 24‑character Order ID.</p>
              </div>
            </CardContent>
          </Card>

          {searched && !tracking && (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-6">We couldn't find any tracking information for the order ID you entered.</p>
              <Button onClick={() => navigate("/orders")} variant="outline" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10">
                View Your Orders
              </Button>
            </div>
          )}

          {tracking && (
            <div className="space-y-8">
              <Card className="border-luxury-gold/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-serif font-medium">Order {tracking.id}</h2>
                      <p className="text-muted-foreground">{tracking.estimatedDelivery}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`${getStatusColor(tracking.status.toLowerCase())} capitalize px-3 py-1`}>
                        {tracking.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">TRACKING DETAILS</h3>
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <div>
                        <p className="font-medium">{tracking.carrier}</p>
                        <p className="text-sm text-muted-foreground">Carrier</p>
                      </div>
                      <div>
                        <p className="font-medium">{tracking.trackingNumber}</p>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">ITEMS IN THIS SHIPMENT</h3>
                    <div className="flex flex-wrap gap-4">
                      {tracking.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={item.image}
                              alt={`${item.name} product image`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-6">TRACKING HISTORY</h3>
                    <div className="relative pl-8">
                      {tracking.timeline.map((event, index) => {
                        const IconComponent = event.icon;
                        return (
                          <div key={index} className="mb-8 last:mb-0">
                            <div className="absolute left-0 mt-1">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-luxury-gold/10">
                                <IconComponent className="h-4 w-4 text-luxury-gold" />
                              </div>
                              {index < tracking.timeline.length - 1 && (
                                <div className="absolute left-3.5 top-7 h-[calc(100%-28px)] w-px bg-luxury-gold/20"></div>
                              )}
                            </div>
                            <div className="pl-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                <h3 className="text-base font-medium">{event.status}</h3>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(event.date).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={() => tracking && navigate(`/order/${tracking.orderId}`)}
                  className="bg-luxury-gold hover:bg-luxury-gold/90"
                >
                  View Order Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
