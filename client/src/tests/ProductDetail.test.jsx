import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../Pages/ProductDetails';
import useProductDetails from '../hooks/useProductDetails';
import { useAuth0 } from '@auth0/auth0-react';
import useAddToCart from '../hooks/useAddToCart';
import useQuantity from '../hooks/useQuantity';

// Mock hooks
jest.mock('../hooks/useProductDetails');
jest.mock('@auth0/auth0-react');
jest.mock('../hooks/useAddToCart');
jest.mock('../hooks/useQuantity');

// Mock useParams
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

describe('ProductDetails Component Tests', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ productId: '1' });
  });

  test('renders product details', () => {
    useProductDetails.mockReturnValue({
      product: {
        id: 1,
        title: 'Product 1',
        price: 10,
        image: '/img1.jpg',
        category: 'Category 1',
        description: 'Description of Product 1',
      },
      loading: false,
      error: null,
    });
    useAuth0.mockReturnValue({ isAuthenticated: true });
    useQuantity.mockReturnValue({
      quantity: 1,
      increment: jest.fn(),
      decrement: jest.fn(),
    });
    useAddToCart.mockReturnValue(jest.fn());

    render(<ProductDetails />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Description of Product 1')).toBeInTheDocument();
  });

  test('handles add to cart for authenticated user', async () => {
    useProductDetails.mockReturnValue({
      product: {
        id: 1,
        title: 'Product 1',
        price: 10,
        image: '/img1.jpg',
        category: 'Category 1',
        description: 'Description of Product 1',
      },
      loading: false,
      error: null,
    });
    useAuth0.mockReturnValue({ isAuthenticated: true });
    useQuantity.mockReturnValue({
      quantity: 1,
      increment: jest.fn(),
      decrement: jest.fn(),
    });
    const addToCart = jest.fn().mockResolvedValue('Success');
    useAddToCart.mockReturnValue(addToCart);

    render(<ProductDetails />);

    fireEvent.click(screen.getByText('Add to Cart'));

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith(1, 1);
      expect(screen.getByText('Product added to cart successfully!')).toBeInTheDocument();
    });
  });

  test('handles add to cart for unauthenticated user', async () => {
    useProductDetails.mockReturnValue({
      product: {
        id: 1,
        title: 'Product 1',
        price: 10,
        image: '/img1.jpg',
        category: 'Category 1',
        description: 'Description of Product 1',
      },
      loading: false,
      error: null,
    });
    useAuth0.mockReturnValue({ isAuthenticated: false });
    useQuantity.mockReturnValue({
      quantity: 1,
      increment: jest.fn(),
      decrement: jest.fn(),
    });
    useAddToCart.mockReturnValue(jest.fn());

    render(<ProductDetails />);

    const addToCartButton = screen.queryByText('Add to Cart');
    expect(addToCartButton).toBeNull(); // Button should not be present for unauthenticated users

    // Check for login prompt
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('notification disappears after 2 seconds', async () => {
    useProductDetails.mockReturnValue({
      product: {
        id: 1,
        title: 'Product 1',
        price: 10,
        image: '/img1.jpg',
        category: 'Category 1',
        description: 'Description of Product 1',
      },
      loading: false,
      error: null,
    });
    useAuth0.mockReturnValue({ isAuthenticated: true });
    useQuantity.mockReturnValue({
      quantity: 1,
      increment: jest.fn(),
      decrement: jest.fn(),
    });
    const addToCart = jest.fn().mockResolvedValue('Success');
    useAddToCart.mockReturnValue(addToCart);

    render(<ProductDetails />);

    fireEvent.click(screen.getByText('Add to Cart'));

    await waitFor(() => {
      expect(screen.getByText('Product added to cart successfully!')).toBeInTheDocument();
    });

    // Wait for notification to disappear
    await waitFor(() => {
      expect(screen.queryByText('Product added to cart successfully!')).toBeNull();
    }, { timeout: 2500 });
  });
});