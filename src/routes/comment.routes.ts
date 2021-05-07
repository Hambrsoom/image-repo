import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { isCommentOwner } from "../middlewares/isOwner";

const router:Router = Router();

router.get("/:imageId", [checkJwt], CommentController.getAllCommentsForImage);
router.post("/:imnageId", [checkJwt] ,CommentController.postCommentForImage);
router.patch("/:commentId", [checkJwt], [isCommentOwner], CommentController.editComment);
router.delete("/:commentId", [checkJwt], [isCommentOwner], CommentController.deleteComment);

export default router;