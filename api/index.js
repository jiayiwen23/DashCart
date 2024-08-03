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

// POST endpoint to create a new cart using an auth0Id, only if it doesn't already exist
app.post("/create-cart", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub; // Get auth0Id from auth middleware

  // Try to find the user by auth0Id
  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const existingCart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (existingCart) {
    return res.json(existingCart); // If cart exists, return the existing cart
  }

  // Create a new cart associated with the user
  const cart = await prisma.cart.create({
    data: {
      user: { connect: { id: user.id } },
    },
  });

  res.status(201).json(cart);
});

app.listen(8000, () => {
  console.log(`Server running on port 8000`);
});
