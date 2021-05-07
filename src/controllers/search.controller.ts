import { NextFunction, Request, Response } from "express";
import { SearchService } from "../services/search.service";
import jwt_decode from "jwt-decode";
import { Image } from "../entities/image.entity";
import { HttpStatusCode } from "./http-status-code";
import { APIError } from "./error-handlers/api-error";


export class SearchController {

    /** 
        * @openapi
        * /api/search/searchByText:
        *    post:
        *      summary: Get the images which have similar title to the input text
        *      tags: [Search]
        *      parameters:
        *        - name: body
        *          in: body
        *          required: true
        *          schema:
        *               type: object
        *               properties:
        *                   text:
        *                       - type: string 
        *      responses:
        *          '200':
        *              description: Got all the requested images
        *              schema:
        *                   type: array
        *                   items:
        *                       $ref: '#/components/schemas/ReturnImage'
        *          '400':
        *              description: Unable to process the request sent by the client due to invalid syntax
        *          '401':
        *              description: Unauthorized
        *          '500':
        *              description: Failed to retrieve all the images
    */
    static searchByText = async (request: Request, response: Response, next: NextFunction) => {
        const decoded = jwt_decode(request.headers["authorization"]);

        if (!request.body.text) {
            response.sendStatus(HttpStatusCode.BAD_REQUEST);
            return;
        }
        try {
            const images: Image[] = await SearchService.getImagesByText(request.body.text, decoded["userId"]);
            response.status(HttpStatusCode.OK).json(images);
        } catch(error) {
            next(new APIError());
        }
        
    }
}