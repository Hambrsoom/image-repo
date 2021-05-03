import { Request, Response } from "express";
import { SearchService } from "../services/search.service";
import jwt_decode from "jwt-decode";
import { Image } from "../entities/image.entity";
import { HttpStatusCode } from "./http-status-code";


export class SearchController {
    static searchByText = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);

        if (!request.body.text) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        const images: Image[] = await SearchService.getImagesByText(request.body.text, decoded["userId"]);
        response.status(HttpStatusCode.OK).json(images);
    }
}