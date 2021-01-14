import MockAdapter from "axios-mock-adapter";
import { getRepository } from "typeorm";
import { AuthController } from "../../../src/controllers/auth.controller";
import { User } from "../../../src/entities/user.entity";
import { AuthService } from "../../../src/services/auth.service";
import { UserService } from "../../../src/services/user.service";
import httpMocks from "node-mocks-http";
import users from "../../mock-data/users.json";

let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = null;
})

describe("register user", () => {
    test("register a new user successfully and return status 201", async() => {
        // given 
        request.body.username = users[0].username;
        request.body.password = users[0].password;
        UserService.saveUser = jest.fn().mockReturnValue(users[0]);

        // when
        await AuthController.register(request, response);

        // then
        expect(response.statusCode).toBe(201);
    })

    test("register a user with info that already exist return status 409", async() => {
        // // given 
        // request.body.username = users[0].username;
        // request.body.password = users[0].password;
        // const rejectedPromise:Promise<never> = Promise.reject(new Error("fail"));
        // UserService.saveUser = jest.fn().mockReturnValue(rejectedPromise);
        // getRepository(User).save = jest.fn().mockReturnValue(rejectedPromise);

        // // when
        // await AuthController.register(request, response);

        // // then
        // expect(409).toBe(409);
    })
})

