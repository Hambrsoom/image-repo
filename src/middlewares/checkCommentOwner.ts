import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";
import { CommentService } from "../services/comment.service";

export const checkCommentOwner = (request: Request, response: Response, next: NextFunction) => {
    const decoded = jwt_decode(request.headers["authorization"]);
    const commentID: number = Number(request.params.id);

    if(!CommentService.isOwnerOfComment(decoded["userId"], commentID)) {
        response.status(401).send("You are not authorized to delete this picture because you are not its owner");
        return;
    }
    next();
};