import { CreateProductDto } from "../dto/create-product.dto";
import { IAttribute } from "../interfaces/attribute.interfaces";
import { IProduct } from "../interfaces/product.interface";
import { ProductRepo } from "../repositories/product.repository";
import { SubCategoriesOnProductsRepo } from "../repositories/subcategoriesonproducts.repo";
import { AttributeService } from "./attribute.service";

export interface IBaseService {
    findAll(): Promise<IProduct[]>
    findById(id: number): Promise<IProduct>
    create(t: CreateProductDto): Promise<Omit<IProduct, "attributes">>
    delete(id: number): Promise<Omit<IProduct, "attributes">>
    updateAttributeByProduct(attributesAfter: IAttribute[], productId: number): Promise<any>;
    update(id: number, t: IProduct): Promise<Omit<IProduct, "attributes">>;
}

export class ProductService implements IBaseService {
    private _prodRepo: ProductRepo;
    private _attribServ: AttributeService;
    private _sp: SubCategoriesOnProductsRepo;
    constructor(prod: ProductRepo = new ProductRepo(), attribServ: AttributeService = new AttributeService(), sp: SubCategoriesOnProductsRepo = new SubCategoriesOnProductsRepo()){
        this._prodRepo = prod;
        this._attribServ = attribServ;
        this._sp = sp;
    }
    async findAll(): Promise<IProduct[]> {
        const products = await this._prodRepo.findAll();
        return products;
    }

    async findById(id: number): Promise<IProduct> {
        const p = await this._prodRepo.findById(id);
        const subcategories = p.subcategories.map((el: any) => el.subcategory);
        let product = {...p, subcategories};
        return product;
    }

    //pass
    //{name: "ao tanktop", content: "", attributes: [{name: "size", options: [{name: "l"}]}]}
    async create(t: CreateProductDto): Promise<Omit<IProduct, "attributes">> {
        //create product, setcategoryId
        const productNew = await this._prodRepo.create(t);
        //create attribute
        await this._attribServ.createMany(t.attributes.map(el => ({...el, productId: productNew.id})));

        //create subcategoriesonproducts
        await Promise.all(t.subcategories.map(async id => {
            await this._sp.create({productId: productNew.id, subcategoryId: id});
        }))
        return productNew;
    }

    async delete(id: number): Promise<Omit<IProduct, "attributes">> {
        const product = await this._prodRepo.delete(id);
        return product;
    }

    async updateAttributeByProduct(attributesAfter: IAttribute[], productId: number): Promise<any> {
        const productBefore: IProduct = await this.findById(productId);

        const attributeBefore: IAttribute[] = productBefore.attributes;
        const attributeBeforeId = attributeBefore.map(el => el.id);

        const attributesAfterId: number[] = attributesAfter.map(el => el.id);

        const optionCreate: IAttribute[] = attributesAfter.filter((option: IAttribute) => !attributeBeforeId.includes(option.id));
        const optionUpdate: IAttribute[] = attributesAfter.filter((option: IAttribute) => attributeBeforeId.includes(option.id));
        const optionDelete: IAttribute[] = attributeBefore.filter((option: IAttribute) => !attributesAfterId.includes(option.id));

        await this._attribServ.createMany(optionCreate.map(el => ({...el, productId})));
        await this._attribServ.updateMany(optionUpdate.map(el => ({...el, productId})));
        await this._attribServ.deleteMany(optionDelete.map(el => el.id));
    }

    async update(id: number, t: CreateProductDto): Promise<Omit<IProduct, "attributes">> {
        //product, set categoryId
        const product = await this._prodRepo.update(id, t);
        //attribute
        await this.updateAttributeByProduct(t.attributes, id);

        //subcategoriesonproduct
        await this._sp.deleteByProduct(id);
        await Promise.all(t.subcategories.map(async subcategoryId => {
            await this._sp.create({productId: id, subcategoryId})
        }))

        return product;
    }
}
