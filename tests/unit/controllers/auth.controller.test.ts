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
        await AuthController.register(request, response, next);

        // then
        expect(response.statusCode).toBe(201);
    })

    test("register a user with no info passed and return status 404", async() => {
        // given 
        request.body.username = undefined;
        request.body.password = undefined;
        const rejectedPromise = Promise.reject();
        UserService.saveUser = jest.fn().mockReturnValue(rejectedPromise);

        try{
            // when
            await AuthController.register(request, response, next);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(404);
        }
    })
});

describe("login user", () => {
    test("login a user successfully and return status 200", async() => {
        // given 
        request.body.username = users[0].username;
        request.body.password = users[0].password;
        const user: User = new User();
        UserService.getUserByUsername = jest.fn().mockReturnValue(user);
        AuthService.login = jest.fn().mockReturnValue("123");
        // when
        
        await AuthController.login(request, response, next);

        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData().token).toBe("123");
    })

    test("login a user with no info passed and return status 400", async() => {
        // given 
        request.body.username = undefined;
        request.body.password = undefined;
        const rejectedPromise = Promise.reject();
        UserService.getUserByUsername = jest.fn().mockReturnValue(rejectedPromise);

        try{
            // when
            await AuthController.register(request, response, next);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(400);
        }
    })

    test("login a user with wrong password passed and return status 400", async() => {
        // given 
        request.body.username = users[0].username;
        request.body.password = "wrong password";
        const user: User = new User();
        user.username = users[0].username;
        user.password = users[0].password;
        UserService.getUserByUsername = jest.fn().mockReturnValue(user);
        
        try {
            // when
            await AuthController.login(request, response, next);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(401);
        }

        
    })
})

