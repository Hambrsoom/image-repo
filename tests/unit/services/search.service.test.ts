import images from "../../mock-data/images.json";
import { SearchService } from "../../../src/services/search.service";
import { getRepository } from "typeorm";
import { Image } from "../../../src/entities/image.entity";

jest.mock("typeorm");

describe("Tests for SearchService Methods", () => {
    test("Get the token of a user successfully", async() => {
        //given:
        const text: string = "It is about";
        const userID: number = 1; 
        getRepository(Image).createQueryBuilder = jest.fn().mockReturnValue({	  
            select: jest.fn().mockReturnThis(),    
            where: jest.fn().mockReturnThis(),	
            getMany: jest.fn().mockResolvedValue(images)	
        });

        // when
        const listOfImages: Image[] = await SearchService.getImagesByText(text, userID);

        // then
        expect(listOfImages).toBe(images);
    });
});