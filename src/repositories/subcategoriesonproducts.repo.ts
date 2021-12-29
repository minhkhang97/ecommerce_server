import { prisma } from "../db/prisma";
import { CreateSubCategoriesOnProductsDto } from "../dto/create-subcategoriesonproducts.dto";

export interface ISubCategoriesOnProductsRepo {
    create(t: CreateSubCategoriesOnProductsDto): Promise<any>
    deleteByProduct(id: number): Promise<any>
    deleteBySubCategory(id: number): Promise<any>;
}

export class SubCategoriesOnProductsRepo implements ISubCategoriesOnProductsRepo {

    async create(t: CreateSubCategoriesOnProductsDto): Promise<any> {
        const sp = await prisma.subcategoriesonproducts.create({
            data: {
                productId: t.productId,
                subcategoryId: t.subcategoryId
            }
        })
        return sp;
    }

    async deleteByProduct(id: number): Promise<any> {
        const sp = await prisma.subcategoriesonproducts.deleteMany({
            where: {
                productId: id
            }
        })
        return sp;
    }

    async deleteBySubCategory(id: number): Promise<any> {
        const sp = await prisma.subcategoriesonproducts.deleteMany({
            where: {
                subcategoryId: id
            }
        })
        return sp;
    }
}