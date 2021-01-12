import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkOwner } from "../middlewares/checkOwner";
import path from "path";

import multer from "multer";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: function(req, file, callBack) {
        callBack(null, "./public/uploads/");
    },
    filename: function(req, file, callBack){
        callBack(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

// it gives us couple of middlewares that we can use.
const upload: multer.Multer = multer({storage: storage});

const router: Router = Router();

router.post("/",[checkJwt], upload.single("image") , ImageController.addSingleImage);

router.delete("/deleteSelectedImages", [checkJwt], [checkOwner], ImageController.deleteSelectedImages);

router.delete("/",[checkJwt], ImageController.deleteAllImagesOfUser);

export default router;