import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import Cart from "../Pages/Cart";
import useFetchCartItems from "../hooks/useFetchCartItems";
import useDeleteCartItem from "../hooks/useDeleteCartItem";

// Mocking hooks and dependencies
jest.mock("@auth0/auth0-react");
jest.mock("../hooks/useFetchCartItems");
jest.mock("../hooks/useDeleteCartItem");

const mockUser = {
  name: "John Doe",
  email: "johndoe@example.com",
};

describe("Cart Tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn().mockResolvedValue("mockToken"),
      logout: jest.fn(),
    });

    useFetchCartItems.mockReturnValue({
      cartItems: [
        {
          itemId: 1,
          image: "http://example.com/image.jpg",
          title: "Sample Product",
          price: 10.00,
          quantity: 2,
        },
      ],
      isLoading: false,
      error: null,
      setCartItems: jest.fn(),
    });

    useDeleteCartItem.mockReturnValue({
      deleteCartItem: jest.fn().mockResolvedValue(true),
      isLoading: false,
      error: null,
      setError: jest.fn(),
    });
  });

  test("displays user name correctly", () => {
    render(<Cart />);
    expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
  });

  test("shows loading state when cart items are loading", () => {
    useFetchCartItems.mockReturnValue({
      cartItems: [],
      isLoading: true,
      error: null,
      setCartItems: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error state when there is an error fetching cart items", () => {
    useFetchCartItems.mockReturnValue({
      cartItems: [],
      isLoading: false,
      error: true,
      setCartItems: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText("Error fetching cart items.")).toBeInTheDocument();
  });

  test("displays empty cart message when there are no cart items", () => {
    useFetchCartItems.mockReturnValue({
      cartItems: [],
      isLoading: false,
      error: null,
      setCartItems: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  test("displays cart items correctly", () => {
    render(<Cart />);
    expect(screen.getByText("Your Cart")).toBeInTheDocument();
    expect(screen.getByText("Sample Product")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
  });
});