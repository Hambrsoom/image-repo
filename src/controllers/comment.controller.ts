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
import { FailedToModifyError } from "./error-handlers/failed-to-modify";

export class CommentController {
    /**
       * @openapi
       * /api/comment/{imageId}:
       *    get:
       *      summary: Get the comments of the image with id {imageId}
       *      tags: [Comment]
       *      parameters:
       *        - name: imageId
       *          in: path
       *          required: true
       *          schema:
       *               type: string
       *      responses:
       *          '200':
       *              description: Comments of the specified image
       *              schema:
       *                type: array
       *                items:                    
       *                    $ref: '#/components/schemas/Comment'
       *          '401':
       *              description: Unauthorized
       *          '500':
       *              description: Unable to retrieve all comments of the specified image
    */
    static getAllCommentsForImage = async (request: Request, response: Response, next: NextFunction) => {
        const imageID: number = Number(request.params.imageId);
        try{
            const comments: Comment[] = await CommentService.getAllCommentsForImage(imageID);
            response.status(HttpStatusCode.OK).json(comments);
        } catch(error){
            next(new APIError());
        }     
    }


    /**
       * @openapi
       * /api/comment/{imageId}:
       *    post:
       *      summary: Post a comment on the image with id {imageId}
       *      tags: [Comment]
       *      parameters:
       *        - name: imageId
       *          in: path
       *          required: true
       *          schema:
       *            type: string
       *        - name: body
       *          in: body
       *          required: true
       *          schema:
       *            type: object
       *            properties:
       *                description:
       *                    type: string
       *      responses:
       *          '200':
       *            description: Successfully posted a new comment on the specified image
       *            schema:
       *                $ref: '#/components/schemas/Comment'
       *          '400':
       *            description: Unable to process the request sent by the client due to invalid syntax
       *          '404':
       *            description: Could not find the specified image
       *          '401':
       *            description: Unauthorized
       *          '500':
       *            description: Failed in storing the Comment in the database
    */
    static postCommentForImage = async (request: Request, response: Response, next: NextFunction) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const imageID: number = Number(request.params.imageId);
        const description: string = request.body["description"];

        if (!description) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        let image: Image;
        try {
            image = await ImageService.getImageById(imageID);
        } catch(error) {
            next(new NotFoundError(imageID, "Image"));
            return;
        }

        try {
            const comment: Comment = await CommentService.postCommentForImage(image, decoded["userId"], description);
            response.status(HttpStatusCode.OK).json(comment);
        } catch(error) {
            next(new FailedToStoreError("Comment"));
        }
    }

    /**
       * @openapi
       * /api/comment/{commentId}:
       *    patch:
       *      summary: Edit the comment with id {commentId}
       *      tags: [Comment]
       *      parameters:
       *        - name: commentId
       *          in: path
       *          required: true
       *          schema:
       *            type: string
       *        - name: body
       *          in: body
       *          required: true
       *          schema:
       *            type: object
       *            properties:
       *                description:
       *                    type: string
       *      responses:
       *          '200':
       *            description: Successfully edited the comment
       *            schema:
       *                $ref: '#/components/schemas/Comment'
       *          '400':
       *            description: Unable to process the request sent by the client due to invalid syntax
       *          '401':
       *            description: Unauthorized
       *          '500':
       *            description: Failed to Modify the Comment with id ${commentId}
    */
    static editComment = async (request: Request, response: Response, next: NextFunction) => {
        const description: string = request.body["description"];
        const commentID: number = Number(request.params.commentId);

        if(!description) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        try {
            const updatedComment: Comment = await CommentService.editCommentForImage(commentID, description);
            response.status(HttpStatusCode.OK).json(updatedComment);
        } catch(error) {
            next(new FailedToModifyError("Comment", commentID));
        }
    }

    /**
       * @openapi
       * /api/comment/{commentId}:
       *    delete:
       *      summary: Delete the comment with id {commentId}
       *      tags: [Comment]
       *      parameters:
       *        - name: commmentId
       *          in: path
       *          required: true
       *          schema:
       *            type: string
       *      responses:
       *          '200':
       *            description: Successfully deleted the comment
       *          '401':
       *            description: Unauthorized
       *          '404':
       *            description: Failed to find the Comment with id ${commentId}
    */
    static deleteComment = async (request: Request, response: Response, next: NextFunction) => {
        const commentID: number = Number(request.params.commentId);
        try {
            await CommentService.deleteCommentByID(commentID);
            response.status(HttpStatusCode.OK);
        } catch (error) {
            next(new NotFoundError(commentID, "Comment"));
        }
    }
}