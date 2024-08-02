import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});
console.log("Audience:", process.env.AUTH0_AUDIENCE);
console.log("Issuer:", process.env.AUTH0_ISSUER);

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

  console.log(auth0Id, email, name);
  console.log(req.auth);

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

// get cart by id and include all cart items
app.get("/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid cart ID" });
  }
  try {
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        cartItems: true, // Include related cart items
      },
    });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

//create a new cart and link to user
app.post("/carts", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const newCart = await prisma.cart.create({
      data: { userId: parseInt(userId) },
    });

    // Update the user's cartId
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { cartId: newCart.id },
    });

    res.status(201).json(newCart);
  } catch (error) {
    console.error("Failed to create cart:", error);
    res.status(500).json({ error: "Failed to create cart" });
  }
});

// delete a cart by id and delete user's cartid
app.delete("/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid cart ID" });
  }
  try {
    // Find the cart first to get the userId
    const cart = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Delete the cart
    const deletedCart = await prisma.cart.delete({
      where: { id },
    });

    // Update the user's cartId to null
    await prisma.user.update({
      where: { id: cart.userId },
      data: { cartId: null },
    });

    res.json(deletedCart);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.error("Failed to delete cart:", error);
    res.status(500).json({ error: "Failed to delete cart" });
  }
});

//create a new cart item linked to a cart
app.post("/cart-items", async (req, res) => {
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !productId || !quantity) {
    return res
      .status(400)
      .json({ error: "Cart ID, product ID, and quantity are required" });
  }
  try {
    // Ensure the cart exists
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(cartId) },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Create the new cart item
    const newCartItem = await prisma.cartItem.create({
      data: {
        cartId: parseInt(cartId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        cart: {
          connect: { id: parseInt(cartId) },
        },
      },
    });
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("Failed to create cart item:", error);
    res.status(500).json({ error: "Failed to create cart item" });
  }
});

// get a specific cart item in a specific cart
app.get("/carts/:cartId/items/:productId", async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);

  if (isNaN(cartId) || isNaN(productId)) {
    return res.status(400).json({ error: "Invalid cart ID or product ID" });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json(cartItem);
  } catch (error) {
    console.error("Failed to fetch cart item:", error);
    res.status(500).json({ error: "Failed to fetch cart item" });
  }
});

// update a specific cart item in a specific cart
app.put("/carts/:cartId/items/:productId", async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;

  if (isNaN(cartId) || isNaN(productId)) {
    return res.status(400).json({ error: "Invalid cart ID or product ID" });
  }

  if (!quantity) {
    return res.status(400).json({ error: "Quantity is required" });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: parseInt(quantity) },
    });

    res.json(updatedCartItem);
  } catch (error) {
    console.error("Failed to update cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// delete a specific cart item in a specific cart
app.delete("/carts/:cartId/items/:productId", async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);

  if (isNaN(cartId) || isNaN(productId)) {
    return res.status(400).json({ error: "Invalid cart ID or product ID" });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    res.json(deletedCartItem);
  } catch (error) {
    console.error("Failed to delete cart item:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});
