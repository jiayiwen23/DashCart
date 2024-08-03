import fetch from "node-fetch";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadProductsToDatabase() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }
  const products = await response.json();

  const productInsertions = products.map((product) => ({
    title: product.title,
    price: new Prisma.Decimal(product.price),
    image: product.image,
    category: product.category,
  }));

  await prisma.product.createMany({
    data: productInsertions,
    skipDuplicates: true,
  });

  console.log("Products successfully loaded into the database");
}
