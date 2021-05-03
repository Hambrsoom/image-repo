import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { isCommentOwner } from "../middlewares/isOwner";

const router:Router = Router();

router.get("/:id", [checkJwt], CommentController.getAllCommentsForImage);
router.post("/:id", [checkJwt] ,CommentController.postCommentForImage);
router.patch("/:id", [checkJwt], [isCommentOwner], CommentController.editComment);
router.delete("/:id", [checkJwt], [isCommentOwner], CommentController.deleteComment);

export default router;