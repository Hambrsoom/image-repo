import httpMocks from "node-mocks-http";
import comments from "../../mock-data/comments.json";
import images from "../../mock-data/images.json";
import { CommentController } from "../../../src/controllers/comment.controller";
import { CommentService } from "../../../src/services/comment.service"; 
import { ImageService } from "../../../src/services/image.service";
import  { Comment } from "../../../src/entities/comment.entity";

let request, response, next;

beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = null;
})



describe("Tests for CommentController methods", ()=> {
    test("get all the comments for an image succesffuly and return status 200", async() => {
        // given
        CommentService.getAllCommentsForImage = jest.fn().mockReturnValue(comments);

        // when
        await CommentController.getAllCommentsForImage(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(comments);
    });

    test("get all the comments for an image fail and return status 500", async() => {
        // given
        const rejectedPromise = Promise.reject();
        CommentService.getAllCommentsForImage = jest.fn().mockReturnValue(rejectedPromise);

        // when
        await CommentController.getAllCommentsForImage(request, response);
        
        // then
        expect(response.statusCode).toBe(500);
    });

    test("add a comment on an image succesfully and return status 200", async()=> {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1
        request.body.description = "Beautiful Painting";
        ImageService.getImageByID = jest.fn().mockReturnValue(images[0]);
        CommentService.postCommentForImage = jest.fn().mockReturnValue(comments[0]);

        // when
        CommentController.postCommentForImage(request, response);

        // then
        expect(response.statusCode).toBe(200);
    });
    
    test("add a comment on an image fail for not passing a description and return status 400", async()=> {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1
        request.body.description = undefined;

        try {
            // when
            CommentController.postCommentForImage(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(400);
        }
    });

    test("add a comment on an image fail for not finding the image and return status 404", async()=> {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1
        request.body.description = "Beautiful Painting";
        const rejectedPromise = Promise.reject();
        ImageService.getImageByID = jest.fn().mockReturnValue(rejectedPromise);

        try {
            // when
            CommentController.postCommentForImage(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(404);
        }
    });

    test("add a comment on an image fail and return status 500", async()=> {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1
        request.body.description = "Beautiful Painting";
        const rejectedPromise = Promise.reject();
        ImageService.getImageByID = jest.fn().mockReturnValue(images[0]);
        CommentService.postCommentForImage = jest.fn().mockReturnValue(rejectedPromise);
        try {
            // when
            CommentController.postCommentForImage(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(500);
        }
    });

    test("edit comment by id succesfully and return status 200", async() => {
        // given
        request.headers["authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        request.params.id = 1;
        request.body.description = "Can I buy this paint?";
        const newComment: Comment = comments[0];
        newComment.description = "Can I buy this paint?";
        CommentService.editCommentForImage = jest.fn().mockReturnValue(newComment);
               

        // when
        await CommentController.editComment(request, response);
        
        // then
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData().description).toStrictEqual(newComment.description);
    });

    test("edit comment by id fail for not passing a description and return status 400", async() => {
        // given
        request.params.id = 1;
        request.body.description = undefined;
        try{
            // when
            await CommentController.editComment(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(400);
        }
    });

    test("edit comment by id fail for not finding a comment and return status 404", async() => {
        // given
        request.params.id = 12;
        request.body.username = "Hampic";
        const rejectedPromise = Promise.reject();
        CommentService.editCommentForImage = jest.fn().mockReturnValue(rejectedPromise);

        try{
            // when
            await CommentController.editComment(request, response);
        } catch(error) {
            // then
            expect(response.statusCode).toBe(404);
        }
    });

    test("delete user by id succesfully and return 200", async()=>{
        request.params.id = 1;
        CommentService.deleteCommentByID = jest.fn().mockReturnValue(true);

        await CommentController.deleteComment(request, response);

        expect(response.statusCode).toBe(200);
    });

    test("delete user by id fail and return 404", async()=>{
        request.params.id = 1;
        const rejectedPromise = Promise.reject();
        CommentService.deleteCommentByID = jest.fn().mockReturnValue(rejectedPromise);

        await CommentController.deleteComment(request, response);

        expect(response.statusCode).toBe(404);
    });
});