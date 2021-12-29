import { IOption } from "../interfaces/option.interfaces";

import { prisma } from "../db/prisma";

export interface IOptionRepo {
    findAll(): Promise<IOption[]>
    findById(id: number): Promise<IOption>
    create(t: IOption): Promise<IOption>
    update(id: number, t: IOption): Promise<IOption>
    delete(id: number): Promise<IOption>
}

export class OptionRepository implements IOptionRepo{
    
    async findAll(): Promise<IOption[]> {
        const options = await prisma.option.findMany();
        return options;
    }
    async findById(id: number): Promise<IOption> {
        const option = await prisma.option.findUnique({
            where: {
                id
            }
        })

        if(!option)
            throw new Error("id option ko dung");

        return option;
    }

    async create(t: IOption): Promise<IOption> {
        const option = await prisma.option.create({
            data: {
                name: t.name,
                attributeId: t.attributeId,
            }
        })

        return option;
    }

    async update(id: number, t: IOption): Promise<IOption> {
        const option = await prisma.option.update({
            where: {
                id
            },
            data: {
                ...t
            }
        })
        return option;
    }

    async delete(id: number): Promise<IOption> {
        const option = await prisma.option.delete({
            where: {
                id,
            }
        })
        return option;
    }
    
}