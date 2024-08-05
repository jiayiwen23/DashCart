import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import { loadProductsToDatabase } from "./productLoader.js";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // we are using the audience to get the email and name from the token
  // if your audience is different you should change the key to match your audience
  // the value should match your audience according to this document: https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit#heading=h.fr3s9fjui5yn
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.post("/add-item", requireAuth, async (req, res) => {
  const { productId, quantity } = req.body;
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({ where: { auth0Id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
      include: { product: true }, // Include product details when checking for existing items
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }, // Include product details in the response after update
      });
      res.json({
        item: updatedItem,
        product: updatedItem.product, // Ensure product details are part of the response
      });
    } else {
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
        include: { product: true }, // Include product details in the response after creation
      });
      res.status(201).json({
        item: newItem,
        product: newItem.product, // Ensure product details are part of the response
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put(
  "/cart-items/:itemId/update-quantity",
  requireAuth,
  async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const auth0Id = req.auth.payload.sub;

    try {
      const user = await prisma.user.findUnique({ where: { auth0Id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const cartItem = await prisma.cartItem.findUnique({
        where: { id: parseInt(itemId) },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (quantity > 0) {
        const updatedItem = await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity },
          include: { product: true },
        });
        res.json(updatedItem);
      } else {
        throw new Error("Quantity cannot be negative");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete("/cart-items/:itemId", requireAuth, async (req, res) => {
  const { itemId } = req.params;
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: parseInt(itemId),
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.cart.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to cart item" });
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete cart item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/cart-items", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            product: true, // Include product details with each cart item
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const formattedCartItems = cart.cartItems.map((item) => ({
      itemId: item.id,
      quantity: item.quantity,
      product: {
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
      },
    }));

    res.json(formattedCartItems); // Send the formatted cart items with product details
  } catch (error) {
    console.error("Failed to retrieve cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8000, async () => {
  console.log(`Server running on port 8000`);
  try {
    await loadProductsToDatabase();
    console.log("Products loaded successfully");
  } catch (err) {
    console.error("Failed to load products", err);
  }
});
