import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import image from "./image.routes";

const routes:Router = Router();

routes.use("/image", image);
routes.use("/auth", auth);
routes.use("/user", user);

export default routes;