import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import image from "./image.routes";
import search from "./search.routes";

const routes:Router = Router();

routes.use("/image", image);
routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/search", search);

export default routes;