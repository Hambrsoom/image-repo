import { NextFunction, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { CommentService } from "../services/comment.service";
import { Comment } from "../entities/comment.entity";
import { ImageService } from "../services/image.service";
import { Image } from  "../entities/image.entity";
import { HttpStatusCode } from "./http-status-code";
import { NotFoundError } from "./error-handlers/not-found-error";
import { APIError } from "./error-handlers/api-error";
import { FailedToStoreError } from "./error-handlers/failed-to-store-error";

export class CommentController {

    static getAllCommentsForImage = async (request: Request, response: Response, next: NextFunction) => {
        const imageID: number = Number(request.params.id);
        try{
            const comments: Comment[] = await CommentService.getAllCommentsForImage(imageID);
            response.status(HttpStatusCode.OK).json(comments);
        } catch(error){
            next(new APIError());
        }     
    }

    static postCommentForImage = async (request: Request, response: Response, next: NextFunction) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const imageID: number = Number(request.params.id);
        const description: string = request.body["description"];

        if (!description) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        let image: Image;
        try {
            image = await ImageService.getImageByID(imageID);
        } catch(error) {
            next(new NotFoundError(imageID, "Image"));
            return;
        }

        try {
            const comment: Comment = await CommentService.postCommentForImage(image, decoded["userId"], description);
            response.status(HttpStatusCode.OK).json(comment);
        } catch(error) {
            next(new FailedToStoreError("Image"));
        }
    }

    static editComment = async (request: Request, response: Response, next: NextFunction) => {
        const description: string = request.body["description"];
        const commentID: number = Number(request.params.id);

        if(!description) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        try {
            const updatedComment: Comment = await CommentService.editCommentForImage(commentID, description);
            response.status(HttpStatusCode.OK).json(updatedComment);
        } catch(error) {
            next(new NotFoundError(commentID, "Comment"));
        }
    }

    static deleteComment = async (request: Request, response: Response, next: NextFunction) => {
        const commentID: number = Number(request.params.id);
        try {
            await CommentService.deleteCommentByID(commentID);
            response.status(200).send("The comment is deleted succesffuly");
        } catch (error) {
            next(new NotFoundError(commentID, "Comment"));
        }
    }
}