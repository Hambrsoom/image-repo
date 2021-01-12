import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";
import { ImageService } from "../services/image.service";

export const checkOwner = (request: Request, response: Response, next: NextFunction) => {
    const decoded = jwt_decode(request.headers["authorization"]);

    for(let imageID of request.body.listOfImageIDs) {
        if(!ImageService.isOwnerOfImage(decoded["userId"], Number(imageID))) {
            response.status(401).send("You are not authorized to delete this picture because you are not its owner");
            return;
        }
    }
    next();
};