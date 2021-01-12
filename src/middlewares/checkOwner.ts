import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";
import { ImageService } from "../services/image.service";

export const checkOwner = (request: Request, response: Response, next: NextFunction) => {
    console.log("I am here actually ");
    const decoded = jwt_decode(request.headers["authorization"]);
    console.log("Hello 1");
    if(ImageService.isOwnerOfImage(decoded["userId"], Number(request.params.id))){
        console.log("Hello 2");
        next();
    } else {
        response.status(401).send("You are not authorized to delet this picture because you are not its owner");
    }
}