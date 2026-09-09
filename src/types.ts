export type UserRole = 'guest' | 'buyer' | 'farmer';

export type LanguageCode = 'en' | 'hinglish' | 'hi' | 'mr' | 'pa' | 'gu' | 'bn' | 'te' | 'ta' | 'kn';

export type ProductCategory = 'all' | 'grains' | 'veggies' | 'leafy' | 'gourd' | 'fruits' | 'dairy' | 'spices';

export interface ProductItem {
  id: string;
  name: string;
  hindiName: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  unit: string;
  image: string;
  farm: string;
  location: string;
  tags: string[];
  searchKeywords: string;
  inStock: boolean;
  harvestTime: string;
  farmerName: string;
  farmerRating: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
  image: string;
  farm: string;
}

export interface FarmerProduce {
  crop: string;
  hindiName: string;
  qty: number;
  price: number;
  loc: string;
  harvestDate: string;
  expiryDate: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  role: 'buyer' | 'farmer';
  items: string;
  total: number;
  farmerPayout: number;
  time: string;
  status: string;
  deliveryMinutes?: number;
  deliveryRider?: {
    name: string;
    vehicle: string;
    rating: number;
    phone: string;
  };
}

export interface MandiRate {
  id: string;
  mandi: string;
  commodity: string;
  hindiCommodity: string;
  price: number;
  unit: string;
  change: number; // positive or negative percentage
  isUp: boolean;
  apnaAnajPrice: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  badge?: string;
}
