import { getRepository } from "typeorm";
import { Image } from "../entities/image.entity";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";

const fs:any = require("fs");



export class ImageService {
    public static async addSingleImage(name: string, description: string,
        path: string, userID: number, isPublic: boolean = true): Promise<Image> {
        const user: User = await UserService.getUserByID(userID);

        const image: Image = {
            name: name,
            description: description,
            isPublic: isPublic,
            path: path,
            user: user
        };

        return await getRepository(Image).save(image);
    }

    public static async getAllImagesByUserID(userID: number): Promise<Image[]> {
        return getRepository(Image).find({
            where: { user: userID }
        });
    }

    public static async getAllPublicImages(): Promise<Image[]> {
        return getRepository(Image).find({
            where: { isPublic: true }
        });
    }

    public static async getImageByID(imageID: number): Promise<Image> {
        return await getRepository(Image).findOneOrFail({
            where: { id: imageID }
        });
    }

    public static async deleteImageByID(imageID: number): Promise<void> {
        try {
            const image: Image = await ImageService.getImageByID(imageID);
            await getRepository(Image).delete(image);
            await ImageService.deleteImage(image.path);
        } catch (error) {
            throw error("Image is not found");
        }
    }

    public static async deleteImage(path: string): Promise<void> {
        await fs.unlink(path, (err) => {
            if (err) {
                throw err;
            }
            console.log("successfully deleted " + path);
        });
    }

    public static async isOwnerOfImage(authorization: any, imageID: number): Promise<boolean> {
        const decoded = jwt_decode(authorization);

        try {
            await getRepository(Image).findOneOrFail({
                where: {
                    id: imageID,
                    user_id: decoded["userId"]
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

}