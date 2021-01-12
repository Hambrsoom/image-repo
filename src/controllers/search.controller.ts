import { Request, Response } from "express";
import { SearchService } from "../services/search.service";
import jwt_decode from "jwt-decode";
import { Image } from "../entities/image.entity";


export class SearchController {
    static searchByText = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);

        const images: Image[] = await SearchService.getImagesByText(request.body.text, decoded["userId"]);

        response.status(200).json(images);
    }
}