import { NextFunction, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { Image } from "../entities/image.entity";
import { ImageService } from "../services/image.service";
import { APIError } from "./error-handlers/api-error";
import { HttpStatusCode } from "./http-status-code";

export class ImageController {

    /**
       * @openapi
       * /api/image:
       *    post:
       *      summary: Post an image
       *      tags: [Image]
       *      parameters:
       *        - name: image
       *          in: formData
       *          type: file
       *        - name: description
       *          in: formData
       *          type: String
       *        - name: name
       *          in: formData
       *          type: String
       *        - name: isPublic
       *          in: formData
       *          type: boolean
       *      responses:
       *          '200':
       *                description: Successfully posted a new image
       *                schema:
       *                    $ref: '#/components/schemas/ReturnImage'
       *          '400':
       *                description: Unable to process the request sent by the client due to invalid syntax
       *          '401':
       *                description: Unauthorized
       *          '500':
       *                description: Failed in storing the Image in the database
    */
    static addSingleImage = async (request: Request, response: Response, next: NextFunction) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        let {name, description, isPublic} = request.body;

        if (!(name && description && request['file'])) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        try {
            let image: Image;
            if (typeof isPublic === "undefined") {
                image = await ImageService.addSingleImage(name, description, request['file'], decoded["userId"]);
            } else {
                isPublic = isPublic.toLowerCase() === "true";
                image = await ImageService.addSingleImage(name, description, request['file'], decoded["userId"], Boolean(isPublic));
            }
            response.status(HttpStatusCode.OK).json(image);
        } catch(error) {
            console.log(error);
            next(new APIError());
        }
    }


    /** 
       * @openapi
       * /api/image/{userId}:
       *    get:
       *      summary: Get the images of the user with {userId}
       *      tags: [Image]
       *      parameters:
       *        - name: userId
       *          in: path
       *          required: true
       *          schema:
       *               type: string
       *      responses:
       *          '200':
       *              description: Images of the specified user
       *              schema:
       *                type: array
       *                items:                    
       *                    $ref: '#/components/schemas/ReturnImage'
       *          '401':
       *              description: Unauthorized
       *          '500':
       *              description: Failed to retrieve all images of the specified user
    */
    
    static getAllImagesByUserID = async (request: Request, response: Response, next: NextFunction) => {
        const userId: number = Number(request.params.userId);

        try {
            const images: Image[] = await ImageService.getAllImagesByUserID(userId);
            response.status(HttpStatusCode.OK).json(images);
        } catch(error) {
            next(new APIError());
        }
        
    }

    /** 
       * @openapi
       * /api/image/publicImages:
       *    get:
       *      summary: Get all the public images
       *      tags: [Image]
       *      responses:
       *          '200':
       *              description: Got public images
       *              schema:
       *                type: array
       *                items:                    
       *                    $ref: '#/components/schemas/ReturnImage'
       *          '401':
       *              description: Unauthorized
       *          '500':
       *              description: Failed to retrieve all public images
    */
    static getAllPublicImages = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const images: Image[] = await ImageService.getAllPublicImages();
            response.status(HttpStatusCode.OK).json(images);
        } catch(error) {
            next(new APIError());
        }
        
    }

    /** 
       * @openapi
       * /api/image/deleteSelectedImages:
       *    delete:
       *      summary: Delete the specified list of images
       *      tags: [Image]
       *      parameters:
       *        - name: body
       *          in: body
       *          required: true
       *          schema:
       *               type: object
       *               properties:
       *                 listOfImageIDs:
       *                    type: array
       *                    items:
       *                        type: number
       *      responses:
       *          '200':
       *              description: Deleted the specified images.
       *          '400':
       *              description: Unable to process the request sent by the client due to invalid syntax
       *          '401':
       *              description: Unauthorized
       *          '500':
       *              description: Failed to delete the selected images
    */
    static deleteSelectedImages = async (request: Request, response: Response, next: NextFunction) => {
        if (!(request.body.listOfImageIDs || Object.keys(request.body.listOfImageIDs).length > 0)) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }

        try{
            for (let imageID of request.body.listOfImageIDs) {
                await ImageService.deleteImageByID(Number(imageID));
            }
            response.sendStatus(HttpStatusCode.OK);
        } catch(error) {
            next(new APIError());
        }  
    }
}