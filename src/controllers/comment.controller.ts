import { Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { CommentService } from "../services/comment.service";
import { Comment } from "../entities/comment.entity";

export class CommentController {

    static getAllCommentForImage = async (request: Request, response: Response) => {
        const imageID: number = Number(request.params.id);
        const comments: Comment[] = await CommentService.getAllCommentsForImage(imageID);
        response.status(200).json(comments);
    }

    static postCommentForImage = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const commentID: number = Number(request.params.id);
        const description: string = request.body["description"];

        const comment: Comment = await CommentService.postCommentForImage(commentID, decoded["userId"], description);

        response.status(200).json(comment);
    }

    static editComment = async (request: Request, response: Response) => {
        const description: string = request.body["description"];
        const commentID: number = Number(request.params.id);

        const updatedComment: Comment = await CommentService.editCommentForImage(commentID, description);

        response.status(200).json(updatedComment);
    }

    static deleteComment = async ( request: Request, response: Response) => {
        const commentID: number = Number(request.params.id);
        await CommentService.deleteCommentByID(commentID);
        response.sendStatus(200);
    }

}