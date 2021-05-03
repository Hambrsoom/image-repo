import * as jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import config from "../../config/config";


export class AuthService {
    public static async login(user: User) {
         // sing JWT, valid for 1 hour
        return jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
    }
}