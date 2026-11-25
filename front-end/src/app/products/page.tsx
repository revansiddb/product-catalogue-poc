'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory, searchProducts } from '../../api/products';
import ProductGrid from '../../components/ProductGrid';

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') ?? '';
  const q = searchParams.get('q') ?? '';

  const catQuery = useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });

  const searchQuery = useQuery({
    queryKey: ['products', 'search', q],
    queryFn: () => searchProducts(q),
    enabled: !!q && !category,
  });

  useEffect(() => {
    if (!category && !q) {
      router.replace('/');
    }
  }, [category, q, router]);

  if (category) {
    const { data, isLoading, error } = catQuery;
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          <p className="text-lg font-medium">Failed to load products.</p>
          <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>
        </div>
      );
    }
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Category: {capitalize(category)}
        </h1>
        <ProductGrid featured={data?.featured ?? []} rest={data?.rest ?? []} />
      </div>
    );
  }

  if (q) {
    const { data, isLoading, error } = searchQuery;
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          <p className="text-lg font-medium">Failed to load search results.</p>
          <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>
        </div>
      );
    }
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Search results for &ldquo;{q}&rdquo;
        </h1>
        <ProductGrid featured={[]} rest={data ?? []} />
      </div>
    );
  }

  return null;
}
