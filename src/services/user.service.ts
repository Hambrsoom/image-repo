import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";

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
}