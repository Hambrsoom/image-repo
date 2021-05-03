import { getRepository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Image } from "../entities/image.entity";
import { ImageService } from "../services/image.service";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";
import jwt_decode from "jwt-decode";



export class CommentService {
    public static async getAllCommentsForImage(imageID: number): Promise<Comment[]>{
        return getRepository(Comment).find({
            where: { image: imageID }
        });
    }

    public static async postCommentForImage(image: Image, userID: number, description: string): Promise<Comment> {
        const user: User = await UserService.getUserByID(userID);
        const comment: Comment = {
            description: description,
            user: user,
            image: image
        }
        return getRepository(Comment).save(comment);
    }

    public static async editCommentForImage(commentID: number, description: string): Promise<Comment> {
        const comment: Comment = await CommentService.getCommentByID(commentID);
        comment.description = description;
        return getRepository(Comment).save(comment);
    }

    public static async getCommentByID(commentID: number): Promise<Comment> {
        return await getRepository(Comment).findOne(commentID);
    }

    public static async deleteCommentByID(commentID: number): Promise<void> {
        const result = await getRepository(Comment).delete(commentID);
        if (result.affected === 0) {
            throw new Error;
        }
    }

    public static async isOwnerOfComment(authorization: string, commentID: number): Promise<boolean> {
        const decoded = jwt_decode(authorization);

        try{
            await getRepository(Image).findOneOrFail({
                where: {
                    id: commentID,
                    user_id: decoded["userId"]
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}