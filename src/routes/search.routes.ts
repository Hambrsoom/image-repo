import { Router } from "express";
import { SearchController } from "../controllers/search.controller";
import { checkJwt } from "../middlewares/checkJwt";

const router: Router = Router();

router.post("/searchByText", [checkJwt], SearchController.searchByText);

export default router;