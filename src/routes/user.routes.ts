import { Router } from "express";
import UserController from "../controllers/user.controller";
import { checkJwt } from "../middlewares/checkJwt";

const router: Router = Router();

  // get all users
  router.get("/", [checkJwt], UserController.getAllUsers);

  // get one user
  router.get(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.getUserByID
  );

  // edit one user
  router.patch(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.editUserByID
  );

  // delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.deleteUserByID
  );

  export default router;