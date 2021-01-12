import { getRepository } from "typeorm";
import { Image } from "../entities/image.entity";
import { User } from "../entities/user.entity";
const fs:any = require("fs");



export class ImageService {
    public static async getAllImagesByUserID(userID: number): Promise<Image[]> {
        return getRepository(Image).find({
            where: { user: userID }
        });
    }

    public static async getImageByID(imageID: number): Promise<Image> {
        return await getRepository(Image).findOne({
            where: { id: imageID }
        });
    }

    public static async deleteImageByID(imageID: number): Promise<void> {
        const image: Image = await ImageService.getImageByID(imageID);
        await getRepository(Image).delete(image);
        await ImageService.deleteImage(image.path);
    }

    public static async deleteImage(path: string): Promise<void> {
        await fs.unlink(path, (err) => {
            if (err) {
                throw err;
            }
            console.log("successfully deleted " + path);
        });
    }

    public static async isOwnerOfImage(userID: number, imageID: number): Promise<boolean> {
        try{
            await getRepository(Image).findOneOrFail({
                where: {
                    id: imageID,
                    user_id: userID
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

}