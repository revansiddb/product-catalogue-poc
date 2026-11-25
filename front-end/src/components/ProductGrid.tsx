import { Product } from '../types/domain';
import ProductCard from './ProductCard';

interface ProductGridProps {
  featured: Product[];
  rest: Product[];
}

export default function ProductGrid({ featured, rest }: ProductGridProps) {
  if (featured.length === 0 && rest.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">No products found.</p>
    );
  }

  return (
    <div>
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          {featured.length > 0 && (
            <h2 className="text-xl font-bold text-gray-800 mb-4">More Products</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} variant="default" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
