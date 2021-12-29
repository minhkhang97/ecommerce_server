import { IAttribute } from "../interfaces/attribute.interfaces";
import { prisma } from "../db/prisma";

export interface IAttributeRepo {
  findAll(): Promise<IAttribute[]>;
  findById(id: number): Promise<IAttribute>;
  create(t: Omit<IAttribute, "options">): Promise<Omit<IAttribute, "options">>;
  update(id: number, t: Omit<IAttribute, "options">): Promise<Omit<IAttribute, "options">>;
  delete(id: number): Promise<Omit<IAttribute, "options">>;
}

export class AttributeRepo implements IAttributeRepo {
  async findAll(): Promise<IAttribute[]> {
    const attribs = await prisma.attribute.findMany({
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
    });

    return attribs;
  }

  async findById(id: number): Promise<IAttribute> {
    const attrib = await prisma.attribute.findUnique({
      where: {
        id,
      },
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
    });

    if(!attrib)
      throw new Error("id attribute khong dung");

    return attrib;
  }

  async create(
    t: Omit<IAttribute, "options">,
  ): Promise<Omit<IAttribute, "options">> {
    const attrib = await prisma.attribute.create({
      data: {
        name: t.name,
        productId: t.productId,
      },
    });
    return attrib;
  }

  async delete(id: number): Promise<Omit<IAttribute, "options">> {
    const attrib = await prisma.attribute.delete({
      where: {
        id,
      },
    });
    return attrib;
  }

  async update(
    id: number,
    t: Omit<IAttribute, "options">
  ): Promise<Omit<IAttribute, "options">> {
    const attrib = await prisma.attribute.update({
      where: {
        id,
      },
      data: {
        name: t.name,
        productId: t.productId,
      },
    });

    return attrib;
  }
}
