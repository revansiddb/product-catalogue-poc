'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { getProductById } from '../../../api/products';
import EnquiryModal from '../../../components/EnquiryModal';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-10 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg font-medium">Failed to load product.</p>
        {error && <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
          <Image
            src={data.imageUrl}
            alt={data.title}
            width={400}
            height={400}
            className="object-contain max-h-96 w-full"
          />
        </div>

        <div className="space-y-4">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full capitalize">
            {data.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-800 leading-snug">{data.title}</h1>

          <p className="text-3xl font-bold text-green-600">${data.price.toFixed(2)}</p>

          <p className="text-sm text-gray-500">
            ⭐ {data.rating.rate} stars ({data.rating.count} reviews)
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">{data.description}</p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            Send Enquiry
          </button>
        </div>
      </div>

      <EnquiryModal
        product={data}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
