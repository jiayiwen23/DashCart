# DashCart

DashCart is a responsive and secure online retail store built with React, Node.js, Auth0, and Prisma. It offers a seamless shopping experience, allowing users to browse products, view details, and manage their cart with ease.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Backend API Endpoints](#api-endpoints)
- [Database Design](#database-design)
- [Pages](#pages)
- [Responsive Design](#responsive-design)
- [External API Integration](#external-api-integration)
- [Accessibility](#accessibility)
- [Testing](#testing)

## Features

- Anonymous browsing of products and details
- User authentication with Auth0
- Logged-in users receive product recommendations on the homepage
- CRUD operations for cart management
- Responsive design for desktop, tablet, and mobile
- Integration with Fake Store API for product data
- Secure API endpoints with JWT token authentication

## Technologies Used

- Frontend: React
- Backend: Node.js
- Authentication: Auth0
- Database ORM: Prisma
- External API: Fake Store API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm start`

## Backend API Endpoints

The backend API is built with Express.js and provides the following endpoints:

- `GET /ping`: Health check endpoint
- `POST /verify-user`: Verifies and registers users (protected)
- `POST /add-item`: Adds items to the user's cart (protected)
- `PUT /cart-items/:itemId/update-quantity`: Updates cart item quantity (protected)
- `DELETE /cart-items/:itemId`: Deletes a cart item (protected)
- `GET /cart-items`: Retrieves all items in a user's cart (protected)
- `GET /products`: Fetches all products
- `GET /products/:id`: Retrieves a specific product by ID

## Database Design

The application uses Prisma ORM with the following tables:
1. Users
2. Products
3. Cart
4. CartItems

## Pages

1. Homepage: Dynamic content for anonymous and logged-in users
2. Product Details: Detailed product information
3. Login/Register: Auth0 integration for user authentication
4. Cart: User-specific information, their cart and subtotal price
5. Auth Debugger: Displays current authentication token

## Responsive Design

DashCart is fully responsive and optimized for all screen sizes:
- Desktop
- Tablet
- Mobile

## External API Integration

DashCart integrates with the Fake Store API for read-only product data operations.

## Accessibility

Lighthouse accessibility reports are available for 3 key pages, ensuring compliance with accessibility standards.

## Testing

The application includes unit tests for 4 pages using React Testing Library.
