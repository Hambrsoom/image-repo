import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";
import { APIError } from "./error-handlers/api-error";
import { NotFoundError } from "./error-handlers/not-found-error";
import { HttpStatusCode } from "./http-status-code";
import { AlreadyInUseError } from "./error-handlers/already-in-use-error";


export class UserController {
  static getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users: User[] = await UserService.getAllUsers();
      response.status(HttpStatusCode.OK).json(users);
    } catch(error) {
      next(new APIError());
    }
  }

  static getUserByID = async (request: Request, response: Response, next: NextFunction) => {
    const userID: number = Number(request.params.id);
    try {
      const user: User = await UserService.getUserByID(userID);
      response.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      next(new NotFoundError(userID, "User"));
    }
  }

  static editUserByID = async (request: Request, response: Response,  next: NextFunction) => {
    const userID: number = Number(jwt_decode(request.headers["authorization"]));
    const username: string = request.body["username"];

    if (!username) {
      response.sendStatus(HttpStatusCode.BAD_REQUEST);
      return;
    }

    let user: User;

    try {
      user = await UserService.getUserByID(userID);
    } catch (error) {
      next(new NotFoundError(userID, "User"));
      return;
    }

    user.username = username;

    try {
      user = await UserService.saveUser(user);
      response.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      next(new AlreadyInUseError("Username", username));
    }
  }
}