import { getRepository } from "typeorm";
import { Comment } from "../../../src/entities/comment.entity";
import { CommentService } from "../../../src/services/comment.service";
import { UserService } from "../../../src/services/user.service";

import comments from "../../mock-data/comments.json";
import users from "../../mock-data/users.json";
import images from "../../mock-data/images.json";


jest.mock("typeorm");

describe("Tests for CommentService methods", () => {
    test("get all comments for an image successfully", async() => {
        // given
        getRepository(Comment).find = jest.fn().mockReturnValue(comments);
        
        // when
        const listOfComments: Comment[] = await CommentService.getAllCommentsForImage(1);
        
        // then
        expect(listOfComments).toBe(comments);
    });

    test("Add a comment to an image successfully", async() => {
        // given
        getRepository(Comment).save = jest.fn().mockReturnValue(comments[0]);
        UserService.getUserByID = jest.fn().mockReturnValue(users[0]);
        
        // when
        const comment: Comment = await CommentService.postCommentForImage(images[0], users[0].id, "I like this show");
        
        // then
        expect(comment).toBe(comments[0]);
    });

    test("Edit a comment by id successfully", async() => {
        // given
        const oldComment: Comment = comments[0];
        const newComment: Comment = comments[0];
        newComment.description = "I like this picture";

        getRepository(Comment).save = jest.fn().mockReturnValue(comments[0]);
        CommentService.getCommentByID = jest.fn().mockReturnValue(comments[0]);        
        // when
        const comment: Comment = await CommentService.editCommentForImage(comments[0].id, "I like this picture");
        
        // then
        expect(comment).toBe(comments[0]);
    });

    test("get comment by id successfully", async() => {
        // given
        CommentService.getCommentByID = jest.fn().mockReturnValue(comments[0]);
        
        // when
        const comment: Comment = await CommentService.getCommentByID(1);
        
        // then
        expect(comment).toBe(comments[0]);
    });

    test("delet comment by ID successfully", async() => {
        // given
        const result:any = {
            affected: 1
        }
        getRepository(Comment).delete = jest.fn().mockReturnValue(result);
        
        // when
        await CommentService.deleteCommentByID(1);
        
        // then
        expect(getRepository(Comment).delete).toHaveBeenCalledTimes(1);
    });

    test("delete user by id throw error", async() => {
        // given
        const result:any = {
            affected: 0
        };

        getRepository(Comment).delete = jest.fn().mockReturnValue(result);

        try {
            // when
            await CommentService.deleteCommentByID(1);
        } catch(error) {
            // then
            expect(getRepository(Comment).delete).toHaveBeenCalledTimes(1);
        }
    });

    test("is Owner of Image returns true", async() => {
        // given
        const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        getRepository(Comment).findOneOrFail = jest.fn().mockResolvedValue(comments[0]);

        // when 
        const result: boolean = await CommentService.isOwnerOfComment(authorization, 1);
    
        // then
        expect(result).toBe(true);
    });

    test("is Owner of Image returns false", async() => {
        // given
        const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        const rejectedPromise = Promise.reject();
        getRepository(Comment).findOneOrFail = jest.fn().mockResolvedValue(rejectedPromise);

        let result:boolean;
        try{
            // when
            result = await CommentService.isOwnerOfComment(authorization, 123);
        }catch (error) {
            // then
            expect(result).toBe(false);
        }
    });
});