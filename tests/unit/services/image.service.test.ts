import { getRepository } from "typeorm";
import { Image } from "../../../src/entities/image.entity";
import { ImageService } from "../../../src/services/image.service";
import { UserService } from "../../../src/services/user.service";

import images from "../../mock-data/images.json";
import users from "../../mock-data/users.json";

jest.mock("typeorm");

describe("Tests for ImageService methods", () => {
    test("get all images for User with ID successfully", async() => {
        // given
        const imagesForUser: Image[] = images[3];

        // retunring the pictures for the user with ID 3
        getRepository(Image).find = jest.fn().mockReturnValue(imagesForUser);
        
        // when
        const listOfImages: Image[] = await ImageService.getAllImagesByUserID(3);
        
        // then
        expect(listOfImages).toBe(imagesForUser);
    });

    test("Add single image successfully", async() => {
        // given
        getRepository(Image).save = jest.fn().mockReturnValue(images[1]);
        getRepository(Image).findOneOrFail = jest.fn().mockReturnValue(images[1]);
        UserService.getUserByID = jest.fn().mockReturnValue(users[1]);
        
        // when
        const image: Image = await ImageService.addSingleImage(images[1].name, images[1].description, images[1].path, 1);
        
        // then
        expect(images[1]).toBe(image);
    });

    test("get all public images successfully", async() => {
       // given
       const publicImages: Image[] = images.filter(imageElement => imageElement.isPublic === true);
       getRepository(Image).find = jest.fn().mockReturnValue(publicImages);
       
       // when
       const listOfPublicImages: Image[] = await ImageService.getAllPublicImages();
       
       // then
       expect(listOfPublicImages).toBe(publicImages);
    });

    test("delete image by id successfully", async() => {
        // given
        ImageService.getImageById = jest.fn().mockReturnValue(images[0]);
        getRepository(Image).delete = jest.fn().mockReturnValue(true);
        ImageService.deleteImage = jest.fn().mockReturnValue(true);
       
       // when
        await ImageService.deleteImageByID(images[0].id);
       
       // then
       expect(ImageService.getImageById).toHaveBeenCalledTimes(1);
       expect(ImageService.deleteImage).toHaveBeenCalledTimes(1);
       expect(ImageService.deleteImage).toHaveBeenCalledWith(images[0].path);
    });

    test("delete user by id fail", async() => {
        expect.assertions(1)
        // given
        const rejectedPromise = Promise.reject();
        ImageService.getImageById = jest.fn().mockResolvedValue(rejectedPromise);
       
        try{
            // when
            await ImageService.deleteImageByID(1);
        }catch(error) {
            // then
            expect(ImageService.getImageById).toHaveBeenCalledTimes(1);
        }
    });

    test("is Owner of Image returns true", async() => {
        // given
        const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        getRepository(Image).findOneOrFail = jest.fn().mockResolvedValue(images[0]);

        // when 
        const result: boolean = await ImageService.isOwnerOfImage(authorization, 1);
    
        // then
        expect(result).toBe(true);
    });

    test("is Owner of Image returns false", async() => {
        // given
        const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicG90YXRvIiwiaWF0IjoxNjEwNjY2OTcwLCJleHAiOjE2MTA2NzA1NzB9.Dpzq37zh3opw0jHAlQo23yPgxp1daE8olrKpxaOoOsI";
        const rejectedPromise = Promise.reject();
        getRepository(Image).findOneOrFail = jest.fn().mockResolvedValue(rejectedPromise);

        let result:boolean;
        try{
            // when
            result = await ImageService.isOwnerOfImage(authorization, 123);
        } catch (error) {
            // then
            expect(result).toBe(false);
        }
    });
});