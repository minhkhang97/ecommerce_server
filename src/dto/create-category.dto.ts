import { CreateSubCategoryDto } from "./create-subcategory.dto";

export interface CreateCategoryDto {
    id: number,
    name: string,
    products: number[];
    subcategories: CreateSubCategoryDto[];
}