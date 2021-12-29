export interface CreateSubCategoryDto {
    id: number;
    name: string;
    categoryId: number;
    products: number[];
}