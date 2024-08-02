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

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// // Route to retrieve all users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error) {
//     console.error("Failed to fetch users:", error);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// // Route to retrieve a specific user by auth0Id
// app.get("/users/:auth0Id", async (req, res) => {
//   const auth0Id = req.params.auth0Id;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { auth0Id },
//     });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// });

// // Route to create a new user
// app.post("/users", async (req, res) => {
//   const { auth0Id, email, name } = req.body;
//   console.log(auth0Id, email, name);
//   if (!auth0Id || !email || !name) {
//     return res
//       .status(400)
//       .json({ error: "Auth0 ID, email, and name are required" });
//   }
//   try {
//     const newUser = await prisma.user.create({
//       data: { auth0Id, email, name },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error("Failed to create user:", error);
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

// // Route to update an existing user by auth0Id
// app.put("/users/:auth0Id", async (req, res) => {
//   const auth0Id = req.params.auth0Id;
//   const { email, name } = req.body;
//   if (!email || !name) {
//     return res.status(400).json({ error: "Email and name are required" });
//   }
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { auth0Id },
//       data: { email, name },
//     });
//     res.json(updatedUser);
//   } catch (error) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.error("Failed to update user:", error);
//     res.status(500).json({ error: "Failed to update user" });
//   }
// });

// // Route to delete a user by auth0Id
// app.delete("/users/:auth0Id", async (req, res) => {
//   const auth0Id = req.params.auth0Id;
//   try {
//     const deletedUser = await prisma.user.delete({
//       where: { auth0Id },
//     });
//     res.json(deletedUser);
//   } catch (error) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.error("Failed to delete user:", error);
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// });

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

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
