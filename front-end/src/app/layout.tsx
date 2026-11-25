import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Product Catalogue',
  description: 'PoC product catalogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
