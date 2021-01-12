import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import config from "../../config/config";


export class UserService {
    public static async getAllUsers(): Promise<User[]> {
        return await getRepository(User).find({
            select: ["id", "username"]
        });
    }

    public static async getUserByID(userID: number): Promise<User> {
        return await getRepository(User).findOneOrFail(userID, {
            select: ["id", "username"]
        });
    }

    public static async getUserByUsername(username: string): Promise<User> {
        return await getRepository(User).findOneOrFail(
            { where: { username }
        });
    }

    public static async saveUser(user: User): Promise<User> {
        return await getRepository(User).save(user);
    }

    public static async deleteUserByID(userID: number): Promise<void> {
        await getRepository(User).delete(userID);
    }
}