import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkImageOwner } from "../middlewares/checkImageOwner";
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
const upload: multer.Multer = multer(
    {
        storage: storage,
        fileFilter: function (req, file, cb) {
            // accept image only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    });

const router: Router = Router();

router.get("/", [checkJwt], ImageController.getAllImagesByUserID);
router.get("/publicImages", [checkJwt], ImageController.getAllPublicImages);

router.post("/",[checkJwt], upload.single("image") , ImageController.addSingleImage);

router.delete("/deleteSelectedImages", [checkJwt], [checkImageOwner], ImageController.deleteSelectedImages);

router.delete("/",[checkJwt], ImageController.deleteAllImagesOfUser);

export default router;