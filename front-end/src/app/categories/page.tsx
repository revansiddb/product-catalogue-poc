'use client';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories';
import CategoryList from '../../components/CategoryList';

export default function CategoriesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg font-medium">Failed to load categories.</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse by Category</h1>
      <CategoryList categories={data ?? []} />
    </div>
  );
}
