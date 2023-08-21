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
  .post(checkAuth, upload.none(), TobaccoCommentController.create)
  .put(checkAuth, upload.none(), TobaccoCommentController.update)
  .delete(checkAuth, TobaccoCommentController.remove);

router
  .route("/api/comments/coal")
  .post(checkAuth, upload.none(), CoalCommentController.create)
  .put(checkAuth, upload.none(), CoalCommentController.update)
  .delete(checkAuth, CoalCommentController.remove);

export { router };
