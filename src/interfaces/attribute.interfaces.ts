import { IOption } from "./option.interfaces";

export interface IAttribute {
    readonly id: number;
    name: string;
    options: IOption[];
    productId: number;
}