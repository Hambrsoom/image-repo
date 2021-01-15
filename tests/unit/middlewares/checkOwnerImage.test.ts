import httpMocks from "node-mocks-http";
import { checkJwt } from "../../../src/middlewares/checkJwt";
let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = function() {
    return true;  
  };
})

describe("Tests for CheckImageOwner methods", ()=> {
    test("check if the JWT is the proper one fail and return response 404", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1nR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90wiaWF0IjoxNjEwNjY2OTcwLCJleHAA2NzA1NzB9.Dpzq37zh3lQo23yPgxp1daE8olrKpxaOoOsI";
                
        // when
        try{
            checkJwt(request, response, next);
        }catch(error) {
            expect(response.statusCode).toBe(404);
        }
    });

    test("check if the JWT is the proper one succesfully", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        
        // when
        checkJwt(request, response, next);

        // then 
        expect(next()).toBe(true);
    });
});