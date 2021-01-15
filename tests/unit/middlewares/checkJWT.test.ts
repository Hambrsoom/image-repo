import httpMocks from "node-mocks-http";
import { ImageService } from "../../../src/services/image.service";
import { checkImageOwner } from "../../../src/middlewares/checkImageOwner";
let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = function() {
    return true;  
  };
})

describe("Tests for CheckJWT methods", ()=> {
    test("Check if the image Owner is the logged user succesfully", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.listOfImageIDs = [1,2];
        ImageService.isOwnerOfImage = jest.fn().mockReturnValue(true);
        
        // when
        checkImageOwner(request, response, next);

        expect(ImageService.isOwnerOfImage).toHaveBeenCalledTimes(2);
    });

    test("Check if the image Owner is the logged user fail", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.listOfImageIDs = [1,2,3,4];
        ImageService.isOwnerOfImage = jest.fn().mockReturnValue(false);
        
        // when
        checkImageOwner(request, response, next);

        expect(ImageService.isOwnerOfImage).toHaveBeenCalledTimes(1);
    });
});