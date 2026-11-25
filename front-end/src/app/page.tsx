'use client';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '../api/products';
import ProductGrid from '../components/ProductGrid';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h1>
      <ProductGrid featured={[]} rest={data ?? []} />
    </div>
  );
}
