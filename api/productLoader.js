import fetch from "node-fetch";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadProductsToDatabase() {
  // Fetch products from the API
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }
  const products = await response.json();

  // Fetch all existing products from the database
  const existingProducts = await prisma.product.findMany({
    select: { id: true, title: true }, // Fetch both id and title
  });

  // Create a set of existing product titles for quick lookup
  const existingProductTitles = new Set(existingProducts.map((p) => p.title));

  // Filter out products that already exist
  const newProducts = products.filter(
    (product) => !existingProductTitles.has(product.title)
  );

  // Prepare the new products for batch insertion
  const productInsertions = newProducts.map((product) => ({
    title: product.title,
    price: new Prisma.Decimal(product.price),
    image: product.image,
    category: product.category,
    description: product.description
  }));

  // Batch insert new products
  if (productInsertions.length > 0) {
    await prisma.product.createMany({
      data: productInsertions,
      skipDuplicates: true,
    });
    console.log(
      `${productInsertions.length} new products successfully loaded into the database`
    );
  } else {
    console.log("All products are already loaded into the database");
  }

  // Create a set of product titles from the API for quick lookup
  const apiProductTitles = new Set(products.map((product) => product.title));

  // Filter out products that no longer exist in the API
  const productsToDelete = existingProducts.filter(
    (product) => !apiProductTitles.has(product.title)
  );

  // Batch delete products that no longer exist in the API
  if (productsToDelete.length > 0) {
    await prisma.product.deleteMany({
      where: {
        id: {
          in: productsToDelete.map((product) => product.id),
        },
      },
    });
    console.log(
      `${productsToDelete.length} products successfully deleted from the database`
    );
  } else {
    console.log("No products to delete from the database");
  }
}
