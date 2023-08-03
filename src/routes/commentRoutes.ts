import { Router } from "express";
import multer from "multer";
import {
  TobaccoCommentController,
  CoalCommentController,
} from "../controllers";
import { checkAuth } from "../utils";

const router = Router();
const upload: multer.Multer = multer();

router
  .route("/api/comments/tobacco")
  .post(upload.none(), checkAuth, TobaccoCommentController.create)
  .put(upload.none(), checkAuth, TobaccoCommentController.update)
  .delete(checkAuth, TobaccoCommentController.remove);

router
  .route("/api/comments/coal")
  .post(upload.none(), checkAuth, CoalCommentController.create)
  .put(upload.none(), checkAuth, CoalCommentController.update)
  .delete(checkAuth, CoalCommentController.remove);

export { router };
