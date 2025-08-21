import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreditCard, 
  Home,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cartService } from '@/services/cartService';
import { authService } from '@/services/authService';
import { checkoutService } from '@/services/checkoutService';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationSelector from '@/components/LocationSelector';
import { City } from '@/components/admin/types/location.types';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/currency';

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  apartment: z.string().optional(),
  countryId: z.string().min(1, { message: "Country is required" }),
  stateId: z.string().min(1, { message: "State is required" }),
  cityId: z.string().min(1, { message: "City is required" }),
  zipCode: z.string().min(5, { message: "ZIP code is required" }),
  paymentMethod: z.enum(['FlutterWave', 'Cash On Delivery']),
  saveInfo: z.boolean().optional(),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Types for populated backend objects
interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  mainImage: string;
}

interface BackendCartItem {
  product: PopulatedProduct;
  quantity: number;
}

// Type for the backend cart response with populated products
interface BackendCartResponse {
  _id: string;
  user: string;
  items: BackendCartItem[];
  totalPrice: number;
}

const Checkout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadCart = async () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);

      if (authStatus) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user data:', error);
        }
      }

      // Load cart items
      if (authStatus) {
        try {
          const backendCart = await cartService.getBackendCart();
          console.log('Checkout - Backend cart:', backendCart);
          
          if (backendCart?.items && backendCart.items.length > 0) {
            // Type assert the backend cart to handle populated products
            const populatedCart = backendCart as unknown as BackendCartResponse;
            
            // Transform backend cart items to checkout format with proper type handling
            const transformedItems: CheckoutCartItem[] = populatedCart.items.map((item: BackendCartItem) => {
              const product = item.product;
              
              return {
                id: product._id,
                name: product.name || 'Product Name',
                price: product.price || 0,
                quantity: item.quantity,
                image: product.mainImage || '/placeholder.svg'
              };
            });
            setCartItems(transformedItems);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error('Failed to load backend cart:', error);
          setCartItems([]);
        }
      } else {
        const localCart = cartService.getLocalCart();
        setCartItems(localCart);
      }
      
      setLoading(false);
    };

    checkAuthAndLoadCart();
  }, []);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      countryId: '',
      stateId: '',
      cityId: '',
      zipCode: '',
      paymentMethod: 'FlutterWave',
      saveInfo: false,
      notes: '',
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      form.setValue('firstName', nameParts[0] || '');
      form.setValue('lastName', nameParts.slice(1).join(' ') || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.phoneNumber || '');
    }
  }, [user, form]);

  const handleCityChange = (city: City | null, fee: number) => {
    setSelectedCity(city);
    setDeliveryFee(fee);
    if (city) {
      form.setValue('cityId', city._id);
      
      // Safely access state properties with type checking
      if (typeof city.state === 'object' && city.state !== null) {
        form.setValue('stateId', city.state._id);
        
        // Safely access country properties with type checking
        if (typeof city.state.country === 'object' && city.state.country !== null) {
          form.setValue('countryId', city.state.country._id);
        }
      }
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCity) {
      toast({
        title: "City required",
        description: "Please select a city for delivery.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        paymentMethod: data.paymentMethod,
        shippingAddress: {
          address: data.address,
          apartment: data.apartment,
          state: data.stateId,
          city: data.cityId,
          country: data.countryId,
          postalCode: data.zipCode,
        },
        customerInformation: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phoneNumber: data.phone,
        },
        additionalInformation: data.notes,
        currency: 'NGN',
        city: { price: deliveryFee },
      };

      console.log('Submitting order data:', orderData);
      const result = await checkoutService.createOrder(orderData);
      console.log('Order creation result:', result);

      if (result.success) {
        // Handle FlutterWave payment
        if (data.paymentMethod === 'FlutterWave' && result.paymentLink) {
          console.log('Redirecting to FlutterWave payment link:', result.paymentLink);
          
          toast({
            title: "Redirecting to payment",
            description: "You will be redirected to complete your payment.",
          });
          
          // Small delay to show the toast before redirecting
          setTimeout(() => {
            window.location.href = result.paymentLink!;
          }, 1000);
          
          return;
        }

        // For other payment methods, redirect to order complete page
        const orderCompleteData = {
          orderId: result.order?._id || Math.floor(1000 + Math.random() * 9000).toString(),
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          total: total,
          paymentMethod: data.paymentMethod,
          items: cartItems,
          billingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            address: data.address + (data.apartment ? `, ${data.apartment}` : ''),
            city: selectedCity?.name || '',
            state: typeof selectedCity?.state === 'object' ? selectedCity.state.name : '',
            zipCode: data.zipCode,
            country: typeof selectedCity?.state === 'object' && typeof selectedCity.state.country === 'object' ? selectedCity.state.country.name : '',
            phone: data.phone,
            email: data.email,
          }
        };

        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase.",
        });

        navigate('/order-complete', { state: { orderData: orderCompleteData } });
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl mb-8">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-500 w-7 h-7 rounded-full flex items-center justify-center text-sm">
              1
            </div>
            <span className="ml-2 mr-4 text-gray-400">SHOPPING CART</span>
          </div>
          <div className="h-px bg-gray-300 w-8"></div>
          <div className="flex items-center">
            <div className="bg-luxury-gold text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              2
            </div>
            <span className="ml-2 mr-4 font-medium text-luxury-gold">CHECKOUT DETAILS</span>
          </div>
          <div className="h-px bg-gray-300 w-8"></div>
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-500 w-7 h-7 rounded-full flex items-center justify-center text-sm">
              3
            </div>
            <span className="ml-2 text-gray-400">ORDER COMPLETE</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Customer Information */}
                <div className="border border-gray-200 p-6">
                  <h2 className="font-serif text-xl mb-4">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Billing Details */}
                <div className="border border-gray-200 p-6">
                  <h2 className="font-serif text-xl mb-4">Billing Details</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="House number and street name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apartment, suite, unit, etc. (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Apartment, suite, unit, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Location Selector */}
                    <div className="mb-4">
                      <LocationSelector 
                        form={form} 
                        onCityChange={handleCityChange}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="ZIP/Postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="border border-gray-200 p-6">
                  <h2 className="font-serif text-xl mb-4">Additional Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Notes about your order, e.g. special notes for delivery" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Payment */}
                <div className="border border-gray-200 p-6">
                  <h2 className="font-serif text-xl mb-4">Payment</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-start space-x-3 border border-gray-200 p-4 rounded-md">
                              <RadioGroupItem value="FlutterWave" id="flutterwave" className="mt-1" />
                              <div className="grid gap-1.5">
                                <label htmlFor="flutterwave" className="font-medium flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  FlutterWave
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  Pay securely with FlutterWave payment gateway.
                                </p>
                              </div>
                            </div>
                            
                            
                            <div className="flex items-start space-x-3 border border-gray-200 p-4 rounded-md">
                              <RadioGroupItem value="Cash On Delivery" id="cashOnDelivery" className="mt-1" />
                              <div className="grid gap-1.5">
                                <label htmlFor="cashOnDelivery" className="font-medium flex items-center gap-2">
                                  <Home className="h-4 w-4" />
                                  Cash on Delivery
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  Pay with cash upon delivery.
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="saveInfo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Save my information for faster checkout next time
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      Processing... <span className="animate-spin">○</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Place Order · {formatCurrency(total)} <Check className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6 sticky top-8">
              <h2 className="font-serif text-xl mb-4">Your Order</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 bg-gray-50">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {item.quantity}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              )}
              
              <div className="pt-4 border-b border-gray-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                  </div>
                )}
                {selectedCity && (
                  <div className="text-sm text-gray-500 mt-2">
                    Delivery to: {selectedCity.name}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between py-4 border-b border-gray-200">
                <span className="font-medium">Total</span>
                <span className="font-medium text-lg">{formatCurrency(total)}</span>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;
