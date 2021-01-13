import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkCommentOwner } from "../middlewares/checkCommentOwner";

const router:Router = Router();

router.get("/:id", [checkJwt], CommentController.getAllCommentForImage);
router.post("/:id", [checkJwt] ,CommentController.postCommentForImage);
router.patch("/:id", [checkJwt], [checkCommentOwner], CommentController.editComment);
router.delete("/:id", [checkJwt], [checkCommentOwner], CommentController.deleteComment);

export default router;