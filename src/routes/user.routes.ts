import { Router } from "express";
import UserController from "../controllers/user.controller";
import { checkJwt } from "../middlewares/checkJwt";

const router: Router = Router();

  // get all users
  router.get("/", [checkJwt], UserController.getAllUsers);

  // get one user
  router.get(
    "/:id",
    [checkJwt],
    UserController.getUserByID
  );

  // edit one user
  router.patch(
    "/:id",
    [checkJwt],
    UserController.editUserByID
  );

  // delete one user
  router.delete(
    "/:id",
    [checkJwt],
    UserController.deleteUserByID
  );

  export default router;