import { IAttribute } from "./attribute.interfaces";

export interface IProduct {
    readonly id: number;
    name: string;
    content: string;
    attributes: IAttribute[];
    categoryId?: number | null;
}