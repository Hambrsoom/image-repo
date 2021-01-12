import { Request, Response } from "express";
import { validate, ValidationError } from "class-validator";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";


class UserController {

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
      response.status(404).send("User not found");
    }
  }

  static editUserByID = async (request: Request, response: Response) => {
    const userID: number = Number(request.params.id);
    const username: string = request.body;

    let user:User;

    try {
      user = await UserService.getUserByID(userID);
    } catch (error) {
      response.status(404).send("User not found");
      return;
    }

    user.username = username;

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
      response.status(400).json(errors);
      return;
    }

    try {
      user = await UserService.saveUser(user);
      response.status(204).json(user);
    } catch (error) {
      response.status(409).send("username already in use");
    }
  }

  static deleteUserByID = async (request: Request, response: Response) => {
    const userID: number = Number(request.params.id);

    try {
      await UserService.getUserByID(userID);
      UserService.deleteUserByID(userID);
      response.status(204).send("deleted user successfuly");
    } catch (error) {
      response.status(404).send("User not found");
      return;
    }
  }
}

export default UserController;