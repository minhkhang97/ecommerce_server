import express, { Application, Request, Response } from "express";
import { CategoryController } from "./src/controllers/category.controller";
import { ProductController } from "./src/controllers/product.controller";
import { prisma } from "./src/db/prisma";
import cors from 'cors';

const app: Application = express();
const port = 4000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});
const productController = new ProductController();
const categoryController = new CategoryController();
app.get("/products", async (req: Request, res: Response): Promise<Response> => {
  return await productController.get(req, res);
});

app.get(
  "/products/:id",
  async (req: Request, res: Response): Promise<Response> => {
    return await productController.getOne(req, res);
  }
);

app.get(
  "/categories",
  async (req: Request, res: Response): Promise<Response> => {
    return await categoryController.get(req, res);
  }
);

app.get(
    "/categories/:id",
    async (req: Request, res: Response): Promise<Response> => {
      return await categoryController.getOne(req, res);
    }
  );

(async () => {
  await prisma.$connect();
  try {
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
})();
