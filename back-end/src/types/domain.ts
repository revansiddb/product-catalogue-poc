export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  rating: { rate: number; count: number };
}

export interface EnquiryRequest {
  productId: number;
  productTitle: string;
  name: string;
  email: string;
  message: string;
}

export interface CatalogProvider {
  getFeaturedProducts(): Promise<Product[]>;
  getCategories(): Promise<string[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product>;
}

export interface EmailProvider {
  sendEnquiry(enquiry: EnquiryRequest): Promise<void>;
}
