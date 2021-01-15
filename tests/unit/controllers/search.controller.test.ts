import { ImageService } from "../../../src/services/image.service";
import httpMocks from "node-mocks-http";
import images from "../../mock-data/images.json";
import { SearchController } from "../../../src/controllers/search.controller";
import { SearchService } from "../../../src/services/search.service"; 

let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = null;
})


describe("Tests for SearchController methods", ()=> {
    test("search for images by text successfully and return status 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.text = "It is about";
        SearchService.getImagesByText = jest.fn().mockReturnValue(images);

        // when
        await SearchController.searchByText(request, response);

        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(images);
    });

    test("search for images by text fail and return status 400", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.text = undefined;

        try{
            // when
            await SearchController.searchByText(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(400);
        }
    });
});

