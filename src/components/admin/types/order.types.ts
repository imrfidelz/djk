
export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  customerInformation: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
  shippingAddress: {
    address: string;
    apartment?: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
  additionalInformation?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
  paymentMethod: 'Cash On Delivery' | 'Bank Transfer' | 'FlutterWave';
  paymentInfo?: {
    id?: string;
    status?: string;
    updateTime?: string;
    paymentProof?: string;
  };
  totalPrice: number;
  shippingPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isProcessing: boolean;
  isCanceled: boolean;
  isDelivered: boolean;
  deliveredAt?: string;
  isCompleted: boolean;
  canceledAt?: string;
  orderedItems: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  canceledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
