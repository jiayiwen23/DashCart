import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchResult from '../Pages/SearchResult';
import useFetchProducts from '../hooks/useFetchProducts';

// Mock hooks
jest.mock('../hooks/useFetchProducts');

describe('SearchResult Component Tests', () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', price: 10, image: '/img1.jpg' },
    { id: 2, title: 'Product 2', price: 20, image: '/img2.jpg' },
    { id: 3, title: 'Other', price: 30, image: '/img3.jpg' },
  ];

  beforeEach(() => {
    useFetchProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
  });

  test('displays loading state', () => {
    useFetchProducts.mockReturnValueOnce({
      products: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/search?q=product']}>
        <Routes>
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    useFetchProducts.mockReturnValueOnce({
      products: [],
      loading: false,
      error: 'Error fetching products',
    });

    render(
      <MemoryRouter initialEntries={['/search?q=product']}>
        <Routes>
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Error: Error fetching products')).toBeInTheDocument();
  });

  test('displays search results', async () => {
    render(
      <MemoryRouter initialEntries={['/search?q=product']}>
        <Routes>
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Search Results for: product')).toBeInTheDocument();
    });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.queryByText('Other')).not.toBeInTheDocument();
  });

  test('displays no results found', async () => {
    render(
      <MemoryRouter initialEntries={['/search?q=nonexistent']}>
        <Routes>
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });
});