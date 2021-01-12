import { getRepository } from "typeorm";
import { Image } from "../entities/image.entity";


export class SearchService {
    public static async getImagesByText(text: string, userID: number): Promise<Image[]> {
        return await getRepository(Image).createQueryBuilder()
            .select()
            .where("(description LIKE :text or name LIKE :text) and (is_public is :isPublic or user_id LIKE :userID)",
            {text: `%${text}%`, isPublic: true, userID:`%${userID}%`})
            .getMany();
        }
}