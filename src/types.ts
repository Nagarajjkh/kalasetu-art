export type CraftCategory =
  | 'Kasuti Embroidery'
  | 'Beedu Craft'
  | 'Coastal Crafts'
  | 'Handwoven Textiles'
  | 'Traditional Accessories'
  | 'Home Décor'
  | 'Wooden Crafts'
  | 'Natural Material Crafts';

export interface Artisan {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  village: string;
  town: string;
  district: string;
  state: string;
  category: CraftCategory;
  bio: string;
  yearsExperience: number;
  profileImage: string;
  specialties: string[];
  story: string;
  createdAt: number;
  isDemo: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  artisanId: string;
  name: string;
  images: string[];
  price: number;
  category: CraftCategory;
  shortDescription: string;
  description: string;
  quantity: number;
  materials: string[];
  productionTime: string;
  dispatchTime: string;
  rating: number;
  reviewCount: number;
  region: string;
  available: boolean;
  createdAt: number;
  trending: boolean;
  bestseller: boolean;
  provenance: Provenance;
}

export interface Provenance {
  craftName: string;
  regionalOrigin: string;
  materials: string[];
  techniques: string[];
  creationTime: string;
  culturalSignificance: string;
  inspiration: string;
  process: string[];
  sustainability: string;
  artisanNotes: string;
}

export interface CraftStory {
  id: string;
  title: string;
  subtitle: string;
  category: CraftCategory;
  region: string;
  heroImage: string;
  excerpt: string;
  body: string[];
  gallery: string[];
  interview: { question: string; answer: string }[];
  artisanId?: string;
  productId?: string;
  publishedAt: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderMethod = 'mock-payment' | 'whatsapp';
export type PaymentMethod = 'upi' | 'card' | 'cod';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'not-applicable';
export type FulfillmentStatus =
  | 'pending-confirmation'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  artisanId: string;
  artisanName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  customer: CustomerInfo;
  method: OrderMethod;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: number;
  note?: string;
}
