import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import { ImageService } from "../services/image.service";

export const isCommentOwner = (request: Request, response: Response, next: NextFunction) => {
    const commentID: number = Number(request.params.id);

    if(!CommentService.isOwnerOfComment(request.headers["authorization"], commentID)) {
        response.status(401).send("You are not authorized to delete this picture because you are not its owner");
        return;
    }
    next();
};

export const isImageOnwer = (request: Request, response: Response, next: NextFunction) => {

    for(let imageID of request.body.listOfImageIDs) {
        if(!ImageService.isOwnerOfImage(request.headers["authorization"], Number(imageID))) {
            response.status(401).send("You are not authorized to delete this picture because you are not its owner");
            return;
        }
    }
    next();
};