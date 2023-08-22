import { Router } from "express";
import multer from "multer";
import { TobaccoRatingController, CoalRatingController } from "../controllers";
import { checkAuth } from "../utils";
import validations from "../validations";

const router = Router();

const upload: multer.Multer = multer();

router
  .route("/api/rating/tobacco")
  .post(
    checkAuth,
    upload.none(),
    validations.saveTobaccoRating,
    TobaccoRatingController.add
  )
  .put(
    checkAuth,
    upload.none(),
    validations.saveTobaccoRating,
    TobaccoRatingController.update
  )
  .delete(checkAuth, TobaccoRatingController.remove);

router
  .route("/api/rating/coal")
  .post(
    checkAuth,
    upload.none(),
    validations.saveCoalRating,
    CoalRatingController.add
  )
  .put(
    checkAuth,
    upload.none(),
    validations.saveCoalRating,
    CoalRatingController.update
  )
  .delete(checkAuth, CoalRatingController.remove);

export { router };
