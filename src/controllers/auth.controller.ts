import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import * as bcrypt from "bcrypt";
import { IncorrectCredentialsError } from "./error-handlers/authentication-error";
import { HttpStatusCode } from "./http-status-code";
import { AlreadyInUseError } from "./error-handlers/already-in-use-error";

/**
 * @swagger
 * 
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http  
 *      scheme: bearer
 *      bearerFormat: JWT
 * 
 * 
 * security:
 *  bearerAuth: []   
 */


export class AuthController {

    /**
       * @openapi
       * /api/auth/login:
       *    post:
       *      summary: User Login
       *      tags: [Authentication]
       *      parameters:
       *        - name: login
       *          in: body
       *          required: true
       *          schema:
       *               $ref: '#/components/schemas/User'
       *      responses:
       *          '200':
       *              description: User is logged in properly
       *              schemas:
       *                $ref: '#/components/schemas/Token'
       *          '401':
       *              description: Either your username or password is incorrect
       *          '400':
       *              description: Unable to process the request sent by the client due to invalid syntax
    */
    static login = async (request: Request, response: Response, next: NextFunction) => {
      
      let { username, password } = request.body;

      if (!(username && password)) {
        response.sendStatus(HttpStatusCode.BAD_REQUEST);
        return;
      }

      let user: User;
      try {
        user = await UserService.getUserByUsername(username);
      } catch(error) {
        next(new IncorrectCredentialsError());
        return;
      }

      if (!user.validatePassword(password)) {
        next(new IncorrectCredentialsError());
        return;
      }

      const token:any = await AuthService.login(user);

      response.status(HttpStatusCode.OK).json({token:token});
    }

    /**
       * @openapi
       * /api/auth/register:
       *    post:
       *      summary: Registeration of a new user
       *      tags: [Authentication]
       *      parameters:
       *        - name: register
       *          in: body
       *          required: true
       *          schema:
       *               $ref: '#/components/schemas/User'
       *      responses:
       *          '201':
       *              description: User is properly registered in the platform
       *          '401':
       *              description: Username with value (${value}) is already in use
       *          '400':
       *              description: Unable to process the request sent by the client due to invalid syntax
    */
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
