import { IProduct } from "./product.interface";
import { ISubCategory } from "./subcategory.interface";

export interface ISubCategoriesOnProducts {
    productId: number;
    subcategoryId: number;
    product: IProduct;
    subcategory: ISubCategory;
}