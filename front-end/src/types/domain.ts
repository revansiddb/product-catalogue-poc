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

export interface CategoryProducts {
  featured: Product[];
  rest: Product[];
}
