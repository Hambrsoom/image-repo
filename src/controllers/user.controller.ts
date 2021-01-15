import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";

export class UserController {
  static getAllUsers = async (request: Request, response: Response) => {
    try {
      const users: User[] = await UserService.getAllUsers();
      response.status(200).json(users);
    } catch(error) {
      response.sendStatus(500);
    }
  }

  static getUserByID = async (request: Request, response: Response) => {
    const userID: number = Number(request.params.id);
    try {
      const user: User = await UserService.getUserByID(userID);
      response.status(200).json(user);
    } catch (error) {
      response.status(404).send("User is not found");
    }
  }

  static editUserByID = async (request: Request, response: Response) => {
    const userID: number = Number(jwt_decode(request.headers["authorization"]));
    const username: string = request.body["username"];

    if (!username) {
      response.sendStatus(400);
      return;
    }

    let user:User;

    try {
      user = await UserService.getUserByID(userID);
    } catch (error) {
      response.status(404).send("User not found");
      return;
    }

    user.username = username;

    try {
      user = await UserService.saveUser(user);
      response.status(200).json(user);
    } catch (error) {
      response.status(409).send("username already in use");
    }
  }
}