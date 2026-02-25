export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  vendors: VendorOffer[];
  rating: number;
  reviewCount: number;
}

export interface VendorOffer {
  vendorName: string;
  vendorId: string;
  price: number;
  currency: string;
  country: string;
  inStock: boolean;
  shippingDays: number;
  trustScore: number;
  whatsappNumber: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
