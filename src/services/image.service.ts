import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { Image } from "../entities/image.entity";


export class ImageService {
    public static async getAllImagesByUserID(userID: number): Promise<Image[]> {
        return getRepository(Image).find({
            where: { userID }
        });
    }

    public static async getImageByID(imageID: number): Promise<Image> {
        return getRepository(Image).findOne({
            where: { id: imageID }
        });
    }

    public static async deleteImageByID(imageID: number): Promise<void> {
        const image: Image = await ImageService.getImageByID(imageID);
        await getRepository(Image).delete(image);
    }
    
    public static async isOwnerOfImage(userID: number, imageID: number): Promise<boolean> {
        try{
            await getRepository(Image).findOneOrFail({
                where: {
                    id:imageID,
                    user_id: userID
                }
            });
            return true;
        } catch (error){
            return false;
        }
    }

}