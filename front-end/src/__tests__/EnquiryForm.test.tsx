jest.mock('../api/enquiry');

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnquiryForm from '../components/EnquiryForm';
import { sendEnquiry } from '../api/enquiry';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 9.99,
  description: 'desc',
  category: 'cat',
  imageUrl: 'https://example.com/img.jpg',
  rating: { rate: 4, count: 10 },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('EnquiryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<EnquiryForm product={mockProduct} onSuccess={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(sendEnquiry).not.toHaveBeenCalled();
  });

  it('calls sendEnquiry with correct payload on valid input', async () => {
    const user = userEvent.setup();
    (sendEnquiry as jest.Mock).mockResolvedValue({ message: 'Enquiry sent' });

    render(<EnquiryForm product={mockProduct} onSuccess={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => {
      expect(sendEnquiry).toHaveBeenCalled();
      expect((sendEnquiry as jest.Mock).mock.calls[0][0]).toEqual({
        productId: 1,
        productTitle: 'Test Product',
        name: 'Jane',
        email: 'jane@test.com',
        message: 'Hello',
      });
    });
  });

  it('calls onSuccess when API resolves', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    (sendEnquiry as jest.Mock).mockResolvedValue({ message: 'Enquiry sent' });

    render(<EnquiryForm product={mockProduct} onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error message when API rejects', async () => {
    const user = userEvent.setup();
    (sendEnquiry as jest.Mock).mockRejectedValue(new Error('fail'));

    render(<EnquiryForm product={mockProduct} onSuccess={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/failed to send enquiry/i)).toBeInTheDocument();
  });
});
