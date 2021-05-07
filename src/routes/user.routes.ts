import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkJwt } from "../middlewares/checkJwt";

const router: Router = Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", [checkJwt], UserController.getUserByID);
router.patch("/", [checkJwt], UserController.editUsername);

export default router;