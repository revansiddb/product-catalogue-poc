import fetch from 'node-fetch';
import { Product, CatalogProvider } from '../types/domain';

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

export class FakeStoreCatalogAdapter implements CatalogProvider {
  private baseUrl: string;
  private ttlMs: number;
  private cache: Map<string, CacheEntry> = new Map();

  constructor(baseUrl: string, ttlSeconds: number) {
    this.baseUrl = baseUrl;
    this.ttlMs = ttlSeconds * 1000;
  }

  private async cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.data as T;
    }
    const data = await fetcher();
    this.cache.set(key, { data, expiresAt: now + this.ttlMs });
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapProduct(raw: any): Product {
    return {
      id: raw.id,
      title: raw.title,
      price: raw.price,
      description: raw.description,
      category: raw.category,
      imageUrl: raw.image,
      rating: {
        rate: raw.rating?.rate ?? 0,
        count: raw.rating?.count ?? 0,
      },
    };
  }

  private async getAllProducts(): Promise<Product[]> {
    return this.cachedFetch<Product[]>('all_products', async () => {
      const res = await fetch(`${this.baseUrl}/products`);
      if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any[] = (await res.json()) as any[];
      return raw.map((p) => this.mapProduct(p));
    });
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 5);
  }

  async getCategories(): Promise<string[]> {
    return this.cachedFetch<string[]>('categories', async () => {
      const res = await fetch(`${this.baseUrl}/products/categories`);
      if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
      return res.json() as Promise<string[]>;
    });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const res = await fetch(
      `${this.baseUrl}/products/category/${encodeURIComponent(category)}`
    );
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = (await res.json()) as any[];
    return raw
      .map((p) => this.mapProduct(p))
      .sort((a, b) => b.rating.rate - a.rating.rate);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/products/${id}`);
    if (res.status === 404) throw new Error('NOT_FOUND');
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await res.json();
    if (!raw || typeof raw.id !== 'number') {
      throw new Error('NOT_FOUND');
    }
    return this.mapProduct(raw);
  }
}
