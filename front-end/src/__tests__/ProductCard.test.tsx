import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Backpack',
  price: 109.95,
  description: 'A quality backpack',
  category: 'bags',
  imageUrl: 'https://fakestoreapi.com/img/1.jpg',
  rating: { rate: 3.9, count: 120 },
};

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/\$109\.95/)).toBeInTheDocument();
  });

  it('renders rating info with star', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/⭐ 3\.9/)).toBeInTheDocument();
  });

  it('renders View Product button', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('View Product')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('renders Top Pick badge for featured variant', () => {
    render(<ProductCard product={mockProduct} variant="featured" />);
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
  });
});
