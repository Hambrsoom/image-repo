import { ImageService } from "../../../src/services/image.service";
import httpMocks from "node-mocks-http";
import images from "../../mock-data/images.json";
import { ImageController } from "../../../src/controllers/image.controller";

let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = null;
})

describe("Tests for ImageController methods", ()=> {
    test("delete all images of a user succesffuly and return status 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        ImageService.getAllImagesByUserID = jest.fn().mockReturnValue(images);
        ImageService.deleteImageByID = jest.fn().mockReturnValue(true);

        // when
        await ImageController.deleteAllImagesOfUser(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
    });

    test("delete all images of a user who does not have any images succesffuly and return status 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        ImageService.getAllImagesByUserID = jest.fn().mockReturnValue([]);

        // when
        await ImageController.deleteAllImagesOfUser(request, response);

        // then
        expect(response.statusCode).toBe(200);
    });

    test("delete selected images of a user succesffully and return 200", async() => {
         // given 
         request.body.listOfImageIDs = [];

         try{
             // when
             await ImageController.deleteSelectedImages(request, response);
         } catch(error) {
             // then
             expect(response.statusCode).toBe(404);
         }
    });

    test("delete selected images of a user succesffully and return 200", async() => {
        // given 
        request.body.listOfImageIDs = [1,2];
        ImageService.deleteImageByID = jest.fn().mockReturnValue(true);

        try{
            // when
            await ImageController.deleteSelectedImages(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(200);
        }
    });

    test("get all public images of all a users succesffuly and return status 200", async() => {
        // given
        ImageService.getAllPublicImages = jest.fn().mockReturnValue(images);

        // when
        await ImageController.getAllPublicImages(request, response);

        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(images);
    });

    test("get all images of a user succesffuly and return status 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        const listOfImagesOfUser = images.filter(imageELement => imageELement.user.id === 1)
        ImageService.getAllImagesByUserID = jest.fn().mockReturnValue(listOfImagesOfUser);

        // when
        await ImageController.getAllImagesByUserID(request, response);

        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(listOfImagesOfUser);
    });

    test("Add a single image for a user with passing all the necessary info beside isPublic or not successfully and return 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.name = "My visit to Italy";
        request.body.description = "It was beautiful";
        request["file"] = "//tests//images//Daddy's home.jpg";
        ImageService.addSingleImage = jest.fn().mockReturnValue(images[0]);

        // when
        await ImageController.addSingleImage(request, response);

        //then 
        expect(response.statusCode).toBe(200)
    });

    test("Add a single image for a user with passing all the necessary info including isPublic or not successfully and return 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.name = "My visit to Italy";
        request.body.description = "It was beautiful";
        request.body.isPublic = "false";
        request["file"] = "//tests//images//Daddy's home.jpg";
        ImageService.addSingleImage = jest.fn().mockReturnValue(images[0]);

        // when
        await ImageController.addSingleImage(request, response);

        //then 
        expect(response.statusCode).toBe(200)
    });

    test("Add a single image for a user without passing the name or the description and return 400", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.name = undefined;
        request.body.description = undefined;
        request["file"] = undefined;
        ImageService.addSingleImage = jest.fn().mockReturnValue(images[0]);

        // when
        await ImageController.addSingleImage(request, response);

        //then 
        expect(response.statusCode).toBe(400);
    });
    
})