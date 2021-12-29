
import { IOption } from "../interfaces/option.interfaces";
import { OptionRepository } from "../repositories/option.repository";

export interface IOptionService {
    findAll(): Promise<IOption[]>
    findById(id: number): Promise<IOption>
    create(t: IOption): Promise<IOption>
    update(id: number, t: IOption): Promise<IOption>
    delete(id: number): Promise<IOption>;
    //tra ve so phan tu khoi tao thanh cong
    createMany(t: IOption[]): Promise<IOption[]>;
    deleteMany(ids: number[]): Promise<IOption[]>
    updateMany(t: IOption[]): Promise<IOption[]>
}

//pass
export class OptionService implements IOptionService{
    private _opt: OptionRepository;

    constructor(opt: OptionRepository = new OptionRepository()) {
        this._opt = opt;
    }

    async findAll(): Promise<IOption[]> {
        const opts = await this._opt.findAll();
        return opts;
    }

    async findById(id: number): Promise<IOption> {
        const opt = await this._opt.findById(id);
        return opt;
    }

    async create(t: IOption): Promise<IOption> {
        //kiem tra attribute id co ton tai ko

        //create option
        const opt = await this._opt.create(t);
        return opt;
    }

    async update(id: number, t: IOption): Promise<IOption> {
        //kiem tra optionid

        //kiem tra attributeId

        const opt = await this._opt.update(id, t);

        return opt;
    }

    async delete(id: number): Promise<IOption> {
        //kiem tra optionid
        const opt = await this._opt.delete(id);
        return opt;
    }

    async createMany(t: IOption[]): Promise<IOption[]> {
        const opts = await Promise.all(t.map(async (el) => {
            const opt = await this.create(el);
            return opt;
        }))

        return opts;
    }

    async deleteMany(ids: number[]): Promise<IOption[]> {
        const opts = await Promise.all(ids.map(async (id) => {
            const opt = await this.delete(id);
            return opt;
        }))

        return opts;
    }

    async updateMany(t: IOption[]): Promise<IOption[]> {
        const opts = await Promise.all(t.map(async (el) => {
            const opt = await this.update(el.id, el);
            return opt;
        }))

        return opts;
    }
    
}