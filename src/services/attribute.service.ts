import { IAttribute } from '../interfaces/attribute.interfaces';
import { IOption } from '../interfaces/option.interfaces';
import { AttributeRepo } from '../repositories/attribute.repository';
import { OptionService } from './option.service';
export interface IAttributeService {
    findAll(): Promise<IAttribute[]>;
    findById(id: number): Promise<IAttribute>;
    create(t: IAttribute): Promise<Omit<IAttribute, "options">>;
    createMany(t: IAttribute[]): Promise<Omit<IAttribute, "options">[]>;
    update(id: number, t: IAttribute): Promise<Omit<IAttribute, "options">>;
    delete(id: number): Promise<Omit<IAttribute, "options">>;
    deleteMany(ids: number[]): Promise<Omit<IAttribute, "options">[]>
    updateMany(t: IAttribute[]): Promise<Omit<IAttribute, "options">[]>;
    updateOptionByAttribute(optionAfter: IOption[], attributeId: number): Promise<any>;
}

export class AttributeService implements IAttributeService{
    private _attribRepo: AttributeRepo;
    private _optServ: OptionService;
    constructor(attibuteRepo: AttributeRepo = new AttributeRepo(), opt: OptionService = new OptionService()) {
        this._attribRepo = attibuteRepo;
        this._optServ = opt;
    }

    async findAll(): Promise<IAttribute[]> {
        const attribs = await this._attribRepo.findAll();
        return attribs;
    }

    async findById(id: number): Promise<IAttribute> {
        const attrib = await this._attribRepo.findById(id);
        return attrib;
    }
    //{ name: "size", productId: 8, options: [ { name: "l" } ] }
    async create(t: IAttribute): Promise<Omit<IAttribute, "options">> {
        const attribNew = await this._attribRepo.create(t);
        await this._optServ.createMany(t.options.map(el => ({...el, attributeId: attribNew.id})));
        return attribNew;
    }

    //pass
    async createMany(t: IAttribute[]): Promise<Omit<IAttribute, "options">[]> {
        const attribs = await Promise.all(t.map(async (attrib) => {
            const attribNew = await this.create(attrib);
            return attribNew;
        }))

        return attribs;
    }


    async updateOptionByAttribute(optionsAfter: IOption[], attributeId: number): Promise<any> {
        const attributeBefore: IAttribute = await this.findById(attributeId);

        const optionsBefore: IOption[] = attributeBefore.options;
        const optionsBeforeId = optionsBefore.map(el => el.id);

        const optionsAfterId: number[] = optionsAfter.map(el => el.id);

        const optionCreate: IOption[] = optionsAfter.filter((option: IOption) => !optionsBeforeId.includes(option.id));
        const optionUpdate: IOption[] = optionsAfter.filter((option: IOption) => optionsBeforeId.includes(option.id));
        const optionDelete: IOption[] = optionsBefore.filter((option: IOption) => !optionsAfterId.includes(option.id));

        await this._optServ.createMany(optionCreate.map(el => ({...el, attributeId: attributeId})));
        await this._optServ.updateMany(optionUpdate.map(el => ({...el, attributeId: attributeId})));
        await this._optServ.deleteMany(optionDelete.map(el => el.id));

        
    }
    //pass
    //{ id: 8, name: "size", productId: 8, options: [ { id: 3, name: "xl" }, { id: 6, name: "m" } ] }
    //{ id: 6, name: "size", productId: 8, options: [ { name: "l" } ] }
    //{id: 1, name: "size", options: [{id: 1, name: "l"}, {id: 5, name: "m"}]}
    async update(id: number, t: IAttribute): Promise<Omit<IAttribute, 'options'>> {

        const attrib = await this._attribRepo.update(id, t);
        await this.updateOptionByAttribute(t.options, id);

        return attrib;
    }

    async updateMany(t: IAttribute[]): Promise<Omit<IAttribute, 'options'>[]> {
        const attribs = await Promise.all(t.map(async el => {
            const attrib = await this.update(el.id, el);
            return attrib;
        }))

        return attribs;
    }

    async delete(id: number): Promise<Omit<IAttribute, 'options'>> {
        const attrib = await this._attribRepo.delete(id);
        return attrib;
    }

    async deleteMany(ids: number[]): Promise<Omit<IAttribute, 'options'>[]> {
        const attribs = await Promise.all(ids.map(async id => {
            const attrib = await this.delete(id);
            return attrib;
        }))

        return attribs;
    }


}