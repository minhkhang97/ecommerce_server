import { IProduct } from "./product.interface";
import { ISubCategory } from "./subcategory.interface";

export interface ICategory {
    readonly id: number;
    name: string;
    products: IProduct[];
    subCategories: ISubCategory[];
    
}