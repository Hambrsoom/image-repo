import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import * as bcrypt from "bcrypt";
import { IncorrectCredentialsError } from "./error-handlers/authentication-error";
import { HttpStatusCode } from "./http-status-code";
import { AlreadyInUseError } from "./error-handlers/already-in-use-error";

export class AuthController {
    static login = async (request: Request, response: Response, next: NextFunction) => {
      // check if username and password are set
      let { username, password } = request.body;

      if (!(username && password)) {
        response.sendStatus(HttpStatusCode.BAD_REQUEST);
        return;
      }

      let user: User;
      user = await UserService.getUserByUsername(username);

      if (!user.validatePassword(password)) {
        next(new IncorrectCredentialsError());
        return;
      }

      const token:any = await AuthService.login(user);

      response.status(HttpStatusCode.OK).json({token:token});
    }

    static register = async (request: Request, response: Response, next: NextFunction) => {
      let user:User = new User();
      user.username = request.body["username"];
      user.password = request.body["password"];
      
      if (!(user.username && user.password)) {
        response.sendStatus(HttpStatusCode.BAD_REQUEST);
        return;
      }

      const salt:any = await bcrypt.genSalt();
      user.salt = salt;

      user.hashPassword();

      try {
        await UserService.saveUser(user);
        response.sendStatus(HttpStatusCode.CREATED);
      } catch (error) {
        next(new AlreadyInUseError("Username", user.username));
      }
    }
}
