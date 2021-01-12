import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { checkJwt } from "../middlewares/checkJwt";

const router: Router = Router();

  router.post("/", [checkJwt], ImageController.addImage);
  
  export default router;