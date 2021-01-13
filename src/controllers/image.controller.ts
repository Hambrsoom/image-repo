import { Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";
import { Image } from "../entities/image.entity";
import { getRepository } from "typeorm";
import { ImageService } from "../services/image.service";

export class ImageController {
    static addSingleImage = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        let {name, description, isPublic} = request.body;

        if (!(name && description && request.file)) {
            response.sendStatus(400);
            return;
        }

        try {
            let image: Image;
            if (typeof isPublic === "undefined") {
                image = await ImageService.addSingleImage(name, description, request.file.path, decoded["userId"]);
            } else {
                isPublic = isPublic.toLowerCase() === "true";
                image = await ImageService.addSingleImage(name, description, request.file.path, decoded["userId"], Boolean(isPublic));
            }
            response.status(200).json(image);
        } catch(error) {
            response.sendStatus(500);
        }
    }

    static getAllImagesByUserID = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const images: Image[] = await ImageService.getAllImagesByUserID(decoded["userId"]);
        response.status(200).json(images);
    }

    static getAllPublicImages = async (request: Request, response: Response) => {
        const images: Image[] = await ImageService.getAllPublicImages();
        response.status(200).json(images);
    }

    static deleteSelectedImages = async (request: Request, response: Response) => {

        if (!(request.body.listOfImageIDs && Object.keys(request.body.listOfImageIDs).length > 0)) {
            response.sendStatus(400);
            return;
        }

        for (let imageID of request.body.listOfImageIDs) {
            await ImageService.deleteImageByID(Number(imageID));
        }

        response.status(204).send("deleted all selected images successfuly");
    }

    static deleteAllImagesOfUser = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const images: Image[] = await ImageService.getAllImagesByUserID(Number(decoded["userId"]));

        if (images.length === 0) {
            response.status(200).send("The user doesn't have any picture to delete");
        }

        for (let image of images) {
            await ImageService.deleteImageByID(image.id);
        }
        response.status(200).send("deleted all the images of the User successfuly");
    }
}