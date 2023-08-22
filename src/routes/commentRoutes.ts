import { Router } from "express";
import multer from "multer";
import validations from "../validations";
import {
  TobaccoCommentController,
  CoalCommentController,
} from "../controllers";
import { checkAuth } from "../utils";

const router = Router();
const upload: multer.Multer = multer();

router
  .route("/api/comments/tobacco")
  .post(
    checkAuth,
    upload.none(),
    validations.saveTobaccoComment,
    TobaccoCommentController.create
  )
  .put(
    checkAuth,
    upload.none(),
    validations.saveTobaccoComment,
    TobaccoCommentController.update
  )
  .delete(checkAuth, TobaccoCommentController.remove);

router
  .route("/api/comments/coal")
  .post(
    checkAuth,
    upload.none(),
    validations.saveCoalComment,
    CoalCommentController.create
  )
  .put(
    checkAuth,
    upload.none(),
    validations.saveCoalComment,
    CoalCommentController.update
  )
  .delete(checkAuth, CoalCommentController.remove);

export { router };
