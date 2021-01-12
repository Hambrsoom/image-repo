import { Request, Response } from "express";
import jwt_decode from "jwt-decode";

export class ImageController {
    static addImage = async (request: Request, response: Response) => {
        const token = request.headers["authorization"];
        const decoded = jwt_decode(token);
        
    }

}