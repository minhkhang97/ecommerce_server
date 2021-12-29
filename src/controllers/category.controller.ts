import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    private _path = '/categories';
    private _ctService: CategoryService;

    constructor(ctService: CategoryService = new CategoryService()){
        this._ctService = ctService;
    }

    getPath() {
        return this._path;
    }
    //get /products
    async get(req: Request, res: Response): Promise<Response> {
        const categories = await this._ctService.findAll();
        return res.json(categories);
    }

    async getOne(req: Request, res: Response): Promise<Response>{
        const {id} = req.params;
        const number = await this._ctService.findById(Number(id));
        return res.json(number);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const category = await this._ctService.delete(Number(id));
        return res.json(category);
    }

    async post(req: Request, res: Response): Promise<Response> {
        const data = req.body;
        const category = await this._ctService.create(data);
        return res.json(category);
    }

    async put(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const data = req.body;
        const category = await this._ctService.update(Number(id), data);
        return res.json(category);
    }
}