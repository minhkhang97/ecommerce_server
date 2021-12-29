import { CreateCategoryDto } from "../dto/create-category.dto";
import { CreateSubCategoryDto } from "../dto/create-subcategory.dto";
import { ICategory } from "../interfaces/category.interface";
import { CategoryRepository } from "../repositories/category.repo";
import { ProductRepo } from "../repositories/product.repository";
import { SubCategoryService } from "./subcategory.service";
import {ISubCategory} from '../interfaces/subcategory.interface';

export interface ICategoryService {
    findAll(): Promise<any>;
    findById(id: number): Promise<any>;
    create(t: CreateCategoryDto): Promise<any>;
    addCategoryForProduct(categoryId: number, productsId: number[]): Promise<any>;
    delete(id: number): Promise<any>;
    update(id: number, t: CreateCategoryDto): Promise<any>;
    updateSubCategoryByCategory(subcategoriesAfter: CreateSubCategoryDto[], categoryId: number): Promise<any>
}

export class CategoryService implements ICategoryService{
    private _cateRepo: CategoryRepository;
    private _prodRepo: ProductRepo;
    private _sbctServ: SubCategoryService
    constructor(cateRepo: CategoryRepository = new CategoryRepository(), prodRepo: ProductRepo = new ProductRepo(), sbctServ: SubCategoryService = new SubCategoryService()) {
        this._cateRepo = cateRepo;
        this._prodRepo = prodRepo;
        this._sbctServ = sbctServ;
    }

    async findAll(): Promise<any> {
        const categories = await this._cateRepo.findAll();
        return categories;
    }

    async findById(id: number): Promise<any> {
        const category = await this._cateRepo.findById(id);
        return category;
    }

    //pass
    async addCategoryForProduct(categoryId: number, productsId: number[]): Promise<any> {
        //set tat ca ve null
        //tim kiem theo categoryId
        const products = await this._prodRepo.findByCategoryId(categoryId);
        await Promise.all(products.map(async (el: any) => {
            await this._prodRepo.setCategory(el.id, null);
        }))
        //set lai categoryId
        const result = await Promise.all(productsId.map(async el => {
            await this._prodRepo.setCategory(el, categoryId);
        }))

        return result;
    }

    async create(t: CreateCategoryDto): Promise<any> {
        const category = await this._cateRepo.create(t);
        //
        await this.addCategoryForProduct(category.id, t.products);
        //create
        await this._sbctServ.createMany(t.subcategories.map(el => ({...el, categoryId: category.id})));
        return category;

    }

    async delete(id: number): Promise<any> {
        const ct = await this._cateRepo.delete(id);
        return ct;
    }

    //pass

    //{id: 4, name: "ao linh tinh", products: [], subcategories: [{id: 1, name: "ao 2", products: [8]}]}
    async update(id: number, t: CreateCategoryDto): Promise<any> {
        const ct = await this._cateRepo.update(id, t);
        //product
        await this.addCategoryForProduct(id, t.products);

        //subcategory
        await this.updateSubCategoryByCategory(t.subcategories, id);
        return ct;
    }

    async updateSubCategoryByCategory(subcategoriesAfter: CreateSubCategoryDto[], categoryId: number): Promise<any> {
        const categoryBefore: ICategory = await this.findById(categoryId);

        const subcategoriesBefore: ISubCategory[] = categoryBefore.subCategories;
        const subcategoriesBeforeId = subcategoriesBefore.map(el => el.id);

        const subcategoriesAfterId: number[] = subcategoriesAfter.map(el => el.id);

        const needCreate: CreateSubCategoryDto[] = subcategoriesAfter.filter((option: CreateSubCategoryDto) => !subcategoriesBeforeId.includes(option.id));
        const needUpdate: CreateSubCategoryDto[] = subcategoriesAfter.filter((option: CreateSubCategoryDto) => subcategoriesBeforeId.includes(option.id));
        const needDelete: ISubCategory[] = subcategoriesBefore.filter((option: ISubCategory) => !subcategoriesAfterId.includes(option.id));

        await this._sbctServ.createMany(needCreate.map(el => ({...el, categoryId})));
        await this._sbctServ.updateMany(needUpdate.map(el => ({...el, categoryId})));
        await this._sbctServ.deleteMany(needDelete.map(el => el.id));
    }
}