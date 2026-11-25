import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types/domain';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'default';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={`/products/${product.id}`}
      className={`flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
        isFeatured ? 'ring-2 ring-blue-500' : 'border border-gray-100'
      }`}
    >
      <div className="relative h-48 w-full bg-white p-4 flex items-center justify-center border-b border-gray-100">
        {isFeatured && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full">
            Top Pick
          </span>
        )}
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={200}
          height={160}
          className="max-h-40 w-auto object-contain"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="self-start inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full capitalize mb-2">
          {product.category}
        </span>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
          {product.title}
        </h3>

        <p className="text-green-600 font-bold text-base mb-1">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-xs text-gray-500 mb-4">
          ⭐ {product.rating.rate} ({product.rating.count} reviews)
        </p>

        <span className="mt-auto block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          View Product
        </span>
      </div>
    </Link>
  );
}
