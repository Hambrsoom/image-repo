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
        const {name, description, isPublic} = request.body;
        const user: User = await UserService.getUserByID(decoded["userId"]);

        const image: Image = {
            name: name,
            description: description,
            isPublic: isPublic,
            path: request.file.path,
            user: user
        }

        await getRepository(Image).save(image);
        response.sendStatus(200);
    }

    static getAllImagesByUserID = async (request: Request, response: Response) => {
        const decoded = jwt_decode(request.headers["authorization"]);
        const images: Image[] = await ImageService.getAllImagesByUserID(decoded["userId"]);
        response.status(200).json(images);
    }

    static deleteImage = async (request: Request, response: Response) => {
        await ImageService.deleteImageByID(Number(request.params.id));
        response.status(204).send("deleted image successfuly");
    }

}