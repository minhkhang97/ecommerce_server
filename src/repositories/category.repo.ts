import { prisma } from "../db/prisma";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { ICategory } from "../interfaces/category.interface";

export interface ICategoryRepo {
    findAll(): Promise<any>
    findById(id: number): Promise<any>
    create(t: CreateCategoryDto): Promise<any>
    update(id: number, t: CreateCategoryDto): Promise<any>
    delete(id: number): Promise<any>
}

export class CategoryRepository implements ICategoryRepo{
    
    async findAll(): Promise<any> {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                subCategories: true,
                products: true,
            }
        });
        return categories;
    }
    async findById(id: number): Promise<any> {
        const category = await prisma.category.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                products: true,
                subCategories: true,
            }
        })

        if(!category)
            throw new Error("id category ko dung");

        return category;
    }

    async create(t: CreateCategoryDto): Promise<any> {
        const category = await prisma.category.create({
            data: {
                name: t.name,
            }
        })

        return category;
    }

    async update(id: number, t: CreateCategoryDto): Promise<any> {
        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                name: t.name
            }
        })
        return category;
    }

    async delete(id: number): Promise<any> {
        const category = await prisma.category.delete({
            where: {
                id,
            }
        })
        return category;
    }
    
}