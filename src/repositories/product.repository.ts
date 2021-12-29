import { IProduct } from "../interfaces/product.interface";
import { prisma } from "../db/prisma";

export interface IProductRepo {
  findAll(): Promise<any>;
  findById(id: number): Promise<any>;
  create(t: Omit<IProduct, "attributes">): Promise<any>;
  update(id: number, t: Omit<IProduct, "attributes">): Promise<any>;
  delete(id: number): Promise<any>;
  setCategory(productId: number, categoryId: number | null): Promise<any>;
  findByCategoryId(categoryId: number): Promise<any>;
}

export class ProductRepo implements IProductRepo {
  async findAll(): Promise<any> {
    const prds = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        subcategories: {
          select: {
            productId: true,
            subcategoryId: true,
            subcategory: true
          }
        },
        attributes: {
          select: {
            id: true,
            name: true,
            productId: true,
            options: {
              select: {
                id: true,
                name: true,
                attributeId: true,
              },
            },
          },
        },
      },
    });
    return prds;
  }

  async findById(id: number): Promise<any> {
    const prd = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        content: true,
        subcategories: {
          select: {
            productId: true,
            subcategoryId: true,
            subcategory: true
          }
        },
        attributes: {
          select: {
            id: true,
            name: true,
            productId: true,
            options: {
              select: {
                id: true,
                name: true,
                attributeId: true,
              },
            },
          },
        },
      },
    });
    if (!prd) throw new Error("id product khong dung");
    return prd;
  }

  async create(t: Omit<IProduct, "attributes">): Promise<any> {
    const product = await prisma.product.create({
      data: {
        name: t.name,
        content: t.content,
        categoryId: t.categoryId,
      },
    });

    return product;
  }

  async delete(id: number): Promise<any> {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    return product;
  }

  async update(id: number, t: Omit<IProduct, "attributes">): Promise<any> {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: t.name,
        content: t.content,
        categoryId: t.categoryId,
      },
    });
    return product;
  }

  async setCategory(productId: number, categoryId: number | null): Promise<any> {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        categoryId,
      },
    });
    return product;
  }
  
  async findByCategoryId(categoryId: number): Promise<any> {
      const products = await prisma.product.findMany({
        where:{
          categoryId,
        }
      })

      return products
  }
}
