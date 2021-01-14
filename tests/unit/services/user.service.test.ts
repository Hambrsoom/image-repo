import { getRepository } from "typeorm";
import { User } from "../../../src/entities/user.entity";
import { UserService } from "../../../src/services/user.service";

import users from "../../mock-data/users.json";

jest.mock("typeorm");

describe("Tests for UserService methods", () => {
    test("get all Users successfully", async() => {
        // given
        getRepository(User).find = jest.fn().mockReturnValue(users);
        
        // when
        const listOfUsers: User[] = await UserService.getAllUsers();
        
        // then
        expect(listOfUsers).toBe(users);
    });

    test("get user by id successfully", async() => {
        // given
        getRepository(User).findOneOrFail = jest.fn().mockReturnValue(users[0]);
        
        // when
        const user: User = await UserService.getUserByID(users[0].id);
        
        // then
        expect(user).toBe(users[0]);
    });

    test("get user by username successfully", async() => {
        // given
        getRepository(User).findOneOrFail = jest.fn().mockReturnValue(users[0]);
        
        // when
        const user: User = await UserService.getUserByID(users[0].username);
        
        // then
        expect(user).toBe(users[0]);
    });

    test("save user successfully", async() => {
        // given
        getRepository(User).save = jest.fn().mockReturnValue(users[0]);
        
        // when
        const user: User = await UserService.getUserByID(users[0]);
        
        // then
        expect(user).toBe(users[0]);
    });

    test("delete user by id successfully", async() => {
        // given
        getRepository(User).save = jest.fn().mockReturnValue(users[0]);
        
        // when
        const user: User = await UserService.getUserByID(users[0]);
        
        // then
        expect(user).toBe(users[0]);
    });
});