import { CreateSubCategoryDto } from "../dto/create-subcategory.dto";
import { SubCategoriesOnProductsRepo } from "../repositories/subcategoriesonproducts.repo";
import { SubCategoryRepository } from "../repositories/subcategory.repo";

export interface ISubCategoryService {
    create(t: CreateSubCategoryDto): Promise<any>;
    createMany(t: CreateSubCategoryDto[]): Promise<any>;
    update(id: number, t: CreateSubCategoryDto): Promise<any>;
    updateMany(t: CreateSubCategoryDto[]): Promise<any>;
    delete(id: number): Promise<any>;
    deleteMany(ids: number[]): Promise<any>;
}

export class SubCategoryService implements ISubCategoryService {
    private _sbct: SubCategoryRepository;
    private _sp: SubCategoriesOnProductsRepo;
    constructor(sbct: SubCategoryRepository =  new SubCategoryRepository(), sp: SubCategoriesOnProductsRepo = new SubCategoriesOnProductsRepo()){
        this._sbct = sbct;
        this._sp = sp;
    }

    //pass
    async create(t: CreateSubCategoryDto): Promise<any> {
        const sbct = await this._sbct.create(t);
        //create table subcategoriesonproducts
        await Promise.all(t.products.map(async id => {
            await this._sp.create({productId: id, subcategoryId: sbct.id})
        }))
        return sbct;
    }

    async createMany(t: CreateSubCategoryDto[]): Promise<any> {
        await Promise.all(t.map(async el => {
            await this.create(el);
        }))
    }

    //pass
    async update(id: number, t: CreateSubCategoryDto): Promise<any> {
        const sbtc = this._sbct.update(id, t);

        //xoa het di va them lai
        await this._sp.deleteBySubCategory(id);
        await Promise.all(t.products.map(async productId => {
            await this._sp.create({productId, subcategoryId: id})
        }))
        return sbtc;
    }

    async updateMany(t: CreateSubCategoryDto[]): Promise<any> {
        await Promise.all(t.map(async el => {
            await this.update(el.id, el);
        }))
    }

    async delete(id: number): Promise<any> {
        await this._sbct.delete(id);
    }

    async deleteMany(ids: number[]): Promise<any> {
        await Promise.all(ids.map(async id => {
            await this.delete(id);
        }))
    }
}