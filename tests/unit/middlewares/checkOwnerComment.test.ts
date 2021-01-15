import httpMocks from "node-mocks-http";
import { CommentService } from "../../../src/services/comment.service"; 
import { checkCommentOwner } from "../../../src/middlewares/checkCommentOwner";
let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = function() {
    return true;  
  };
})

describe("Tests for CheckCommentOwner methods", ()=> {
    test("Check if the comment Owner is the logged user succesfully", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1;
        CommentService.isOwnerOfComment = jest.fn().mockReturnValue(true);
        
        // when
        checkCommentOwner(request, response, next);

        // then
        expect(CommentService.isOwnerOfComment).toHaveBeenCalledTimes(1);
    });

    test("Check if the comment Owner is the logged user fail", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.body.listOfImageIDs = 1;
        CommentService.isOwnerOfComment = jest.fn().mockReturnValue(false);
        
        // when
        checkCommentOwner(request, response, next);
        
        // then
        expect(CommentService.isOwnerOfComment).toHaveBeenCalledTimes(1);
    });
});