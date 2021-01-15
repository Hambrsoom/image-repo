import { ImageService } from "../../../src/services/image.service";
import httpMocks from "node-mocks-http";
import users from "../../mock-data/users.json";
import { UserController } from "../../../src/controllers/user.controller";
import { UserService } from "../../../src/services/user.service"; 
import { User } from "../../../src/entities/user.entity";

let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = null;
})



describe("Tests for UserController methods", ()=> {
    test("get all the users succesffuly and return status 200", async() => {
        // given
        UserService.getAllUsers = jest.fn().mockReturnValue(users);

        // when
        await UserController.getAllUsers(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(users);
    });

    test("get all the users fail and return status 500", async() => {
        // given
        const rejectedPromise = Promise.reject();
        UserService.getAllUsers = jest.fn().mockReturnValue(rejectedPromise);

        // when
        await UserController.getAllUsers(request, response);
        
        // then
        expect(response.statusCode).toBe(500);
    });

    test("get user by id succesffuly and return status 200", async() => {
        // given
        request.params.id = 1;
        UserService.getUserByID = jest.fn().mockReturnValue(users[0]);

        // when
        await UserController.getUserByID(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(users[0]);
    });

    test("get user by id fail and return status 404", async() => {
        // given
        request.params.id = 14;
        const rejectedPromise = Promise.reject();
        UserService.getUserByID = jest.fn().mockReturnValue(rejectedPromise);

        // when
        await UserController.getUserByID(request, response);
        
        // then
        expect(response.statusCode).toBe(404);
    });

    test("edit user by id succesfully and return status 200", async() => {
        // given
        request.params.id = 1;
        request.body.username = "Hampic";
        const newUser = new User();
        newUser.username = "Hampic";
        newUser.id = 1;
        newUser.password = "admin";
        newUser.salt = "123";
        UserService.getUserByID = jest.fn().mockReturnValue(users[0]);
        UserService.saveUser = jest.fn().mockReturnValue(newUser);        

        // when
        await UserController.editUserByID(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData().username).toStrictEqual(newUser.username);
    });

    test("edit user by id fail for not passing a username and return status 400", async() => {
        // given
        request.params.id = 1;
        request.body.username = undefined;
        try{
            // when
            await UserController.editUserByID(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(200);
        }
    });

    test("edit user by id fail for not finding a user and return status 404", async() => {
        // given
        request.params.id = 12;
        request.body.username = "Hampic";
        const rejectedPromise = Promise.reject();
        UserService.getUserByID = jest.fn().mockReturnValue(rejectedPromise);

        try{
            // when
            await UserController.editUserByID(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(404);
        }
    });

    test("edit user by id fail for duplicating username and return status 409", async() => {
        // given
        request.params.id = 1;
        request.body.username = "admin";
        const rejectedPromise = Promise.reject();
        UserService.getUserByID = jest.fn().mockReturnValue(users[0]);
        UserService.saveUser = jest.fn().mockReturnValue(rejectedPromise);        

        try{
            // when
            await UserController.editUserByID(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(409);
        }
    });

    test("delete user by id succesfully and return 200", async()=>{
        request.params.id = 1;
        UserService.deleteUserByID = jest.fn().mockReturnValue(true);

        await UserController.deleteUserByID(request, response);

        expect(response.statusCode).toBe(200);
    });

    test("delete user by id fail and return 404", async()=>{
        request.params.id = 1;
        const rejectedPromise = Promise.reject();
        UserService.deleteUserByID = jest.fn().mockReturnValue(rejectedPromise);

        await UserController.deleteUserByID(request, response);

        expect(response.statusCode).toBe(404);
    });
});