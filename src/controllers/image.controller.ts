import { Request, Response } from "express";
import jwt_decode from "jwt-decode";


export class ImageController {
    static addImage = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        response.sendStatus(200);
    }
}