import Link from 'next/link';

interface CategoryListProps {
  categories: string[];
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/products?category=${encodeURIComponent(cat)}`}
          className="bg-white border rounded-lg p-6 text-center hover:bg-blue-50 hover:border-blue-500 transition-colors font-medium text-gray-700 block"
        >
          {capitalize(cat)}
        </Link>
      ))}
    </div>
  );
}
