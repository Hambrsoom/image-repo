import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import * as bcrypt from "bcrypt";

export class AuthController {
    static login = async (request: Request, response: Response) => {
      // check if username and password are set
      let { username, password } = request.body;

      if (!(username && password)) {
        response.sendStatus(400);
      }

      let user: User;
      try {
        user = await UserService.getUserByUsername(username);
      } catch (error) {
        response.status(401).send("Either your username or password is incorrect");
      }

      if (!user.validatePassword(password)) {
        response.status(401).send("Either your username or password is incorrect");
        return;
      }

      const token:any = await AuthService.login(user);

      response.status(200).json({token:token});
    }

    static register = async (request: Request, response: Response) => {
      let user:User = new User();
      user.username = request.body["username"];
      user.password = request.body["password"];

      // will generate a unique salt for each user
      const salt:any = await bcrypt.genSalt();
      user.salt = salt;

      // hash the password, to securely store on DB
      user.hashPassword();

      // try to save. If fails, the username is already in use
      try {
        await UserService.saveUser(user);
        response.status(201).send("User created");
      } catch (error) {
        response.status(409).send("Username already in use");
      }
    }
}
