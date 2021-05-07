import { getRepository } from "typeorm";
import { Image } from "../entities/image.entity";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";

const fs:any = require("fs");

export class ImageService {
    public static async addSingleImage(name: string, description: string,
        imageFile: any, userId: number, isPublic: boolean = true): Promise<Image> {
        const user: User = await UserService.getUserByID(userId);
        const image: Image = {
            name: name,
            description: description,
            isPublic: isPublic,
            path: imageFile.path,
            user: user
        };
        const savedImage = await getRepository(Image).save(image)
        return await ImageService.getImageById(savedImage.id);
    }

    public static async getAllImagesByUserID(userId: number): Promise<Image[]> {
        return getRepository(Image).find({
            where: { user: userId },
            relations: ["user", "comments"]
        });
    }

    public static async getAllPublicImages(): Promise<Image[]> {
        return getRepository(Image).find({
            where: { isPublic: true },
            relations: ["user", "comments"]
        });
    }

    public static async getImageById(imageId: number): Promise<Image> {
        return await getRepository(Image).findOneOrFail({
            where: { id: imageId },
            relations: ["user", "comments"]
        });
    }

    public static async deleteImageByID(imageId: number): Promise<void> {
        try {
            const image: Image = await ImageService.getImageById(imageId);
            console.log(image);
            await getRepository(Image).delete(image.id);
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
        console.log(decoded)
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