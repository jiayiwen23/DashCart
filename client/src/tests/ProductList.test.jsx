import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "../components/ProductList/ProductList";
import { useAuth0 } from "@auth0/auth0-react";
import useFetchProducts from "../hooks/useFetchProducts";
import useFetchCartItems from "../hooks/useFetchCartItems";
import { MemoryRouter } from "react-router-dom";

// Mock hooks and components
jest.mock("@auth0/auth0-react");
jest.mock("../hooks/useFetchProducts");
jest.mock("../hooks/useFetchCartItems");

describe("ProductList Component Tests", () => {
  const mockProducts = [
    { id: 1, title: "Product 1", price: 10, image: "/img1.jpg", category: "Category 1" },
    { id: 2, title: "Product 2", price: 20, image: "/img2.jpg", category: "Category 1" },
  ];
  const mockCartItems = [
    { id: 1, category: "Category 1" },
  ];

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
    });
  });

  test("renders trending products", () => {
    useFetchProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    useFetchCartItems.mockReturnValue({
      cartItems: [], // Empty cart for this test
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(screen.getByText("Today's Trending Products")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  test("renders recommended products", async () => {
    useFetchProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    useFetchCartItems.mockReturnValue({
      cartItems: mockCartItems,
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Recommended for You")).toBeInTheDocument();
    });
  });
});