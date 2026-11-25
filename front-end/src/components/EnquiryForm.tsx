'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { sendEnquiry } from '../api/enquiry';
import { Product } from '../types/domain';

interface EnquiryFormProps {
  product: Product;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  email: string;
  message: string;
}

export default function EnquiryForm({ product, onSuccess }: EnquiryFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: sendEnquiry,
    onSuccess: () => {
      setApiError(null);
      onSuccess();
    },
    onError: () => {
      setApiError('Failed to send enquiry. Please try again.');
    },
  });

  function onSubmit(values: FormValues) {
    setApiError(null);
    mutation.mutate({
      productId: product.id,
      productTitle: product.title,
      name: values.name,
      email: values.email,
      message: values.message,
    });
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const errorClass = 'text-red-500 text-xs mt-1';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {apiError && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          type="text"
          className={inputClass}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          {...register('email', {
            required: 'Email is required',
            validate: (v) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
          })}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          {...register('message', {
            required: 'Message is required',
            maxLength: { value: 1000, message: 'Message must be 1000 characters or fewer' },
          })}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        {mutation.isPending ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
