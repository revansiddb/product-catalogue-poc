'use client';
import { useState } from 'react';
import { Product } from '../types/domain';
import EnquiryForm from './EnquiryForm';

interface EnquiryModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ product, open, onClose }: EnquiryModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  function handleSuccess() {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
        >
          ✕
        </button>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-green-700 font-semibold text-lg">
              Enquiry sent! We'll be in touch soon.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Send Enquiry</h2>
            <p className="text-sm text-gray-500 mb-6 line-clamp-1">{product.title}</p>
            <EnquiryForm product={product} onSuccess={handleSuccess} />
          </>
        )}
      </div>
    </div>
  );
}
