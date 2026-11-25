'use client';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
          Product Catalogue
        </Link>
        <Link href="/categories" className="text-sm text-gray-300 hover:text-white transition-colors">
          Categories
        </Link>
      </div>
      <SearchBar />
    </nav>
  );
}
