import { ProductService } from "../services/product.service";
import { Request, Response } from "express";

export class ProductController {
    private _path = '/products';
    private _productService: ProductService;

    constructor(productService: ProductService = new ProductService()){
        this._productService = productService;
    }

    getPath() {
        return this._path;
    }
    //get /products
    async get(req: Request, res: Response): Promise<Response> {
        const products = await this._productService.findAll();
        return res.json(products);
    }

    async getOne(req: Request, res: Response): Promise<Response>{
        const {id} = req.params;
        const product = await this._productService.findById(Number(id));
        return res.json(product);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const product = await this._productService.delete(Number(id));
        return res.json(product);
    }

    async post(req: Request, res: Response): Promise<Response> {
        const data = req.body;
        const product = await this._productService.create(data);
        return res.json(product);
    }

    async put(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const data = req.body;
        const product = await this._productService.update(Number(id), data);
        return res.json(product);
    }
}