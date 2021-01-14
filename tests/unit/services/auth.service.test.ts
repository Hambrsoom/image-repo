import { AuthService } from "../../../src/services/auth.service";
import jwt_decode from "jwt-decode";
import { User } from "../../../src/entities/user.entity";

import users from "../../mock-data/users.json";
jest.mock('typeorm');


describe("Get Token", () => {
    test("Get the token of a user successfully", async() => {

        // when
        const token:any = await AuthService.login(users[0]);
        const decoded = jwt_decode(token);

        // then
        expect(decoded["username"]).toBe(users[0].username);
    });
});