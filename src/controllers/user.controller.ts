import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import jwt_decode from "jwt-decode";
import { APIError } from "./error-handlers/api-error";
import { NotFoundError } from "./error-handlers/not-found-error";
import { HttpStatusCode } from "./http-status-code";
import { AlreadyInUseError } from "./error-handlers/already-in-use-error";

export class UserController {

  /** 
    * @openapi
    * /api/user:
    *    get:
    *      summary: Get all the users
    *      tags: [User]
    *      responses:
    *          '200':
    *              description: Got all the users
    *              schema:
    *                   type: array
    *                   items:
    *                       $ref: '#/components/schemas/UserInfo'          
    *          '401':
    *              description: Unauthorized
    *          '500':
    *              description: Failed to retrieve all the users
  */
  static getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users: User[] = await UserService.getAllUsers();
      response.status(HttpStatusCode.OK).json(users);
    } catch(error) {
      next(new APIError());
    }
  }

  /** 
       * @openapi
       * /api/user/{id}:
       *    get:
       *      summary: Get user by id
       *      tags: [User]
       *      parameters:
       *        - name: id
       *          in: path
       *          required: true
       *          schema:
       *               type: string
       *      responses:
       *          '200':
       *              description: Got user by id
       *              schema:
       *                  $ref: '#/components/schemas/UserInfo'
       *          '401':
       *              description: Unauthorized
       *          '404':
       *              description: Failed to find the User with id ${id}
  */
  static getUserByID = async (request: Request, response: Response, next: NextFunction) => {
    const userId: number = Number(request.params.id);
    try {
      const user: User = await UserService.getUserByID(userId);
      response.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      next(new NotFoundError(userId, "User"));
    }
  }

  /** 
    * @openapi
    * /api/user:
    *    patch:
    *      summary: Edit the username of the logged user
    *      tags: [User]
    *      parameters:
    *        - name: body
    *          in: body
    *          required: true
    *          schema:
    *               type: object
    *               properties:
    *                 username:
    *                   - type: string
    *      responses:
    *          '200':
    *              description: Updated the username of the logged user
    *              schema:
    *                 $ref: '#/components/schemas/UserInfo'
    *          '401':
    *              description: Unauthorized or Username with value (${value}) is already in use
  */
  static editUsername = async (request: Request, response: Response,  next: NextFunction) => {
    const userId: number = Number((jwt_decode(request.headers["authorization"])['userId']));
    const username: string = request.body["username"];

    if (!username) {
      response.sendStatus(HttpStatusCode.BAD_REQUEST);
      return;
    }

    let user: User;

    try {
      user = await UserService.getUserByID(userId);
    } catch (error) {
      next(new NotFoundError(userId, "User"));
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