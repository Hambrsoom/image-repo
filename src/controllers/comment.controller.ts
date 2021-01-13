import { Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { CommentService } from "../services/comment.service";
import { Comment } from "../entities/comment.entity";
import { ImageService } from "../services/image.service";
import { Image } from  "../entities/image.entity";


export class CommentController {

    static getAllCommentsForImage = async (request: Request, response: Response) => {
        const imageID: number = Number(request.params.id);

        if (!(imageID)) {
            response.sendStatus(400);
            return;
        }

        const comments: Comment[] = await CommentService.getAllCommentsForImage(imageID);
        response.status(200).json(comments);
    }

    static postCommentForImage = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const imageID: number = Number(request.params.id);
        const description: string = request.body["description"];

        if (!description) {
            response.sendStatus(400);
            return;
        }

        let image: Image;
        try {
            image = await ImageService.getImageByID(imageID);
        } catch(error) {
            response.status(404).send("Image with id " + imageID + " does not exist");
            return;
        }

        try {
            const comment: Comment = await CommentService.postCommentForImage(image, decoded["userId"], description);
            response.status(200).json(comment);
        } catch(error) {
            response.status(200).send("Failed to post the comment");
        }
    }

    static editComment = async (request: Request, response: Response) => {
        const description: string = request.body["description"];
        const commentID: number = Number(request.params.id);

        if(!description) {
            response.sendStatus(400);
            return;
        }

        try {
            const updatedComment: Comment = await CommentService.editCommentForImage(commentID, description);
            response.status(200).json(updatedComment);
        } catch(error) {
            response.status(404).send("Comment is not found");
        }
    }

    static deleteComment = async ( request: Request, response: Response) => {
        const commentID: number = Number(request.params.id);
        try {
            await CommentService.deleteCommentByID(commentID);
            response.status(200).send("The comment is deleted succesffuly");
        } catch (error) {
            response.status(404).send("Comment is not found");
        }
    }

}