import { IOption } from "../interfaces/option.interfaces";

import { prisma } from "../db/prisma";
import { ISubCategory } from "../interfaces/subcategory.interface";
import { CreateSubCategoryDto } from "../dto/create-subcategory.dto";

export interface ISubCategoryRepo {
    findAll(): Promise<any>
    findById(id: number): Promise<any>
    create(t: CreateSubCategoryDto): Promise<any>
    update(id: number, t: CreateSubCategoryDto): Promise<any>
    delete(id: number): Promise<any>;
}

export class SubCategoryRepository implements ISubCategoryRepo{
    
    async findAll(): Promise<any> {
        const sb = await prisma.subcategory.findMany();
        return sb;
    }
    async findById(id: number): Promise<any> {
        const subCategory = await prisma.subcategory.findUnique({
            where: {
                id
            }
        })

        if(!subCategory)
            throw new Error("id subCategory ko dung");

        return subCategory;
    }

    async create(t: CreateSubCategoryDto): Promise<any> {
        const sb = await prisma.subcategory.create({
            data: {
                name: t.name,
                categoryId: t.categoryId,
            }
        })

        return sb;
    }

    async update(id: number, t: CreateSubCategoryDto): Promise<any> {
        const sb = await prisma.subcategory.update({
            where: {
                id
            },
            data: {
                name: t.name,
                categoryId: t.categoryId,
            }
        })
        return sb;
    }

    async delete(id: number): Promise<any> {
        const subcategory = await prisma.subcategory.delete({
            where: {
                id,
            }
        })
        return subcategory;
    }
    
}