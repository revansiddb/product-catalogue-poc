'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [value, setValue] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        className="rounded-lg px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
}
