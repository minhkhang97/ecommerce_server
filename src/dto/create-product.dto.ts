export interface CreateProductDto {
    id: number,
    name: string,
    content: string,
    attributes: CreateAttributeDto[];
    categoryId: number;
    subcategories: number[];
}

export interface CreateAttributeDto {
    id: number;
    name: string;
    productId: number;
    options: CreateOptionDto[]
}

export interface CreateOptionDto {
    id: number;
    name: string;
    attributeId: number;
}