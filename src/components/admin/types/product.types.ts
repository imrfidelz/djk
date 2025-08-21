
// Product interface used throughout the admin components
export interface Product {
  id: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  description: string;
  images: string[];
  mainImage: string;
  brand: string; // ObjectId as string
  price: number;
  stock: number;
  sold_out?: number;
  size?: {
    label: string;
  }[];
  specifications?: {
    label: string;
    value: string;
  }[];
  color?: {
    label: string;
  }[];
  isLive: boolean;
  isMain: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  liveAt?: Date;
  category: string; // ObjectId as string
  slug?: string;
  status: 'Active' | 'Out of Stock' | 'Draft';
  lastUpdated: string;
}

// Mock data structures
export const mockBrands = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
  { id: '3', name: 'Nike' },
  { id: '4', name: 'Adidas' },
];

export const mockCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Home & Kitchen' },
  { id: '4', name: 'Sports' },
];

// Mock products data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    images: ['headphone1.jpg', 'headphone2.jpg'],
    mainImage: 'headphone1.jpg',
    brand: '1', // Apple
    price: 99.99,
    stock: 45,
    sold_out: 12,
    size: [{ label: 'One Size' }],
    specifications: [
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery Life', value: '20 hours' }
    ],
    color: [{ label: 'Black' }],
    isLive: true,
    isMain: false,
    isFeatured: true,
    isHotDeal: false,
    liveAt: new Date('2024-03-10'),
    category: '1', // Electronics
    slug: 'wireless-headphones',
    status: 'Active',
    lastUpdated: '2024-03-10',
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smart watch with heart rate monitoring',
    images: ['watch1.jpg', 'watch2.jpg'],
    mainImage: 'watch1.jpg',
    brand: '2', // Samsung
    price: 199.99,
    stock: 30,
    sold_out: 8,
    size: [{ label: 'One Size' }],
    specifications: [
      { label: 'Features', value: 'Heart rate monitor, GPS' },
      { label: 'Battery Life', value: '3 days' }
    ],
    color: [{ label: 'Silver' }],
    isLive: true,
    isMain: true,
    isFeatured: true,
    isHotDeal: true,
    liveAt: new Date('2024-03-09'),
    category: '1', // Electronics
    slug: 'smart-watch',
    status: 'Active',
    lastUpdated: '2024-03-09',
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for professional athletes',
    images: ['shoes1.jpg', 'shoes2.jpg'],
    mainImage: 'shoes1.jpg',
    brand: '3', // Nike
    price: 79.99,
    stock: 0,
    sold_out: 50,
    size: [
      { label: 'US 9' },
      { label: 'US 10' },
      { label: 'US 11' }
    ],
    specifications: [
      { label: 'Material', value: 'Lightweight, breathable' }
    ],
    color: [{ label: 'Blue' }],
    isLive: true,
    isMain: false,
    isFeatured: false,
    isHotDeal: false,
    liveAt: new Date('2024-03-08'),
    category: '4', // Sports
    slug: 'running-shoes',
    status: 'Out of Stock',
    lastUpdated: '2024-03-08',
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Premium coffee maker with multiple brewing options',
    images: ['coffeemaker1.jpg', 'coffeemaker2.jpg'],
    mainImage: 'coffeemaker1.jpg',
    brand: '4', // Other
    price: 129.99,
    stock: 15,
    sold_out: 5,
    size: [{ label: 'Standard' }],
    specifications: [
      { label: 'Capacity', value: '12-cup' },
      { label: 'Features', value: 'Programmable timer' }
    ],
    color: [{ label: 'Black' }],
    isLive: true,
    isMain: false,
    isFeatured: false,
    isHotDeal: true,
    liveAt: new Date('2024-03-07'),
    category: '3', // Home & Kitchen
    slug: 'coffee-maker',
    status: 'Active',
    lastUpdated: '2024-03-07',
  },
];
