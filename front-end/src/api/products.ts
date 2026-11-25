import { Product, CategoryProducts } from '../types/domain';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

export async function getProductsByCategory(category: string): Promise<CategoryProducts> {
  const res = await fetch(`${BASE_URL}/products?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}
