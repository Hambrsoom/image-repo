import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";

const routes:Router = Router();

routes.use("/auth", auth);
routes.use("/user", user);

export default routes;