import { Product, Category } from "@/types/product";

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 1240 },
  { id: "fashion", name: "Fashion", icon: "👗", count: 3820 },
  { id: "home", name: "Home & Garden", icon: "🏠", count: 890 },
  { id: "health", name: "Health & Beauty", icon: "💄", count: 1560 },
  { id: "auto", name: "Automotive", icon: "🚗", count: 420 },
  { id: "food", name: "Food & Grocery", icon: "🛒", count: 2100 },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Samsung Galaxy A54 5G – 128GB",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Samsung",
    rating: 4.5,
    reviewCount: 238,
    vendors: [
      { vendorName: "TechZone GH", vendorId: "v1", price: 1850, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 2, trustScore: 92, whatsappNumber: "233200000001", verified: true },
      { vendorName: "PhoneHub Lagos", vendorId: "v2", price: 185000, currency: "NGN", country: "Nigeria", inStock: true, shippingDays: 3, trustScore: 88, whatsappNumber: "2348000000001", verified: true },
      { vendorName: "MobiWorld", vendorId: "v3", price: 2100, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 1, trustScore: 78, whatsappNumber: "233200000003", verified: false },
    ],
  },
  {
    id: "2",
    name: "Nike Air Max 270 – Men's",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Fashion",
    brand: "Nike",
    rating: 4.7,
    reviewCount: 412,
    vendors: [
      { vendorName: "SneakerVault Accra", vendorId: "v4", price: 890, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 3, trustScore: 95, whatsappNumber: "233200000004", verified: true },
      { vendorName: "KickStore KE", vendorId: "v5", price: 12500, currency: "KES", country: "Kenya", inStock: true, shippingDays: 5, trustScore: 82, whatsappNumber: "254700000001", verified: true },
    ],
  },
  {
    id: "3",
    name: "JBL Flip 6 Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "JBL",
    rating: 4.6,
    reviewCount: 189,
    vendors: [
      { vendorName: "SoundPlus GH", vendorId: "v6", price: 750, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 1, trustScore: 90, whatsappNumber: "233200000006", verified: true },
      { vendorName: "AudioKing NG", vendorId: "v7", price: 78000, currency: "NGN", country: "Nigeria", inStock: false, shippingDays: 4, trustScore: 85, whatsappNumber: "2348000000002", verified: true },
    ],
  },
  {
    id: "4",
    name: "Shea Butter – 500g Organic Raw",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    category: "Health & Beauty",
    brand: "Natural Glow",
    rating: 4.8,
    reviewCount: 567,
    vendors: [
      { vendorName: "PureNature GH", vendorId: "v8", price: 45, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 1, trustScore: 97, whatsappNumber: "233200000008", verified: true },
      { vendorName: "BeautyBasket", vendorId: "v9", price: 52, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 2, trustScore: 84, whatsappNumber: "233200000009", verified: false },
    ],
  },
  {
    id: "5",
    name: "HP Laptop 15 – AMD Ryzen 5, 8GB RAM",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "HP",
    rating: 4.3,
    reviewCount: 156,
    vendors: [
      { vendorName: "CompuGhana", vendorId: "v10", price: 5200, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 2, trustScore: 91, whatsappNumber: "233200000010", verified: true },
      { vendorName: "LaptopCity NG", vendorId: "v11", price: 520000, currency: "NGN", country: "Nigeria", inStock: true, shippingDays: 4, trustScore: 87, whatsappNumber: "2348000000003", verified: true },
    ],
  },
  {
    id: "6",
    name: "Ankara Fabric – 6 Yards Premium",
    image: "https://images.unsplash.com/photo-1594761051656-c13bf7100b2e?w=400&h=400&fit=crop",
    category: "Fashion",
    brand: "AfriPrint",
    rating: 4.9,
    reviewCount: 823,
    vendors: [
      { vendorName: "FabricQueen", vendorId: "v12", price: 120, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 1, trustScore: 96, whatsappNumber: "233200000012", verified: true },
      { vendorName: "TextileMart", vendorId: "v13", price: 95, currency: "GHS", country: "Ghana", inStock: true, shippingDays: 2, trustScore: 88, whatsappNumber: "233200000013", verified: true },
    ],
  },
];
