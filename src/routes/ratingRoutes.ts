import { Router } from "express";
import multer from "multer";
import { TobaccoRatingController, CoalRatingController } from "../controllers";
import { checkAuth } from "../utils";

const router = Router();

const upload: multer.Multer = multer();

router
  .route("/api/rating/tobacco")
  .post(checkAuth, upload.none(), TobaccoRatingController.add)
  .put(checkAuth, upload.none(), TobaccoRatingController.update)
  .delete(checkAuth, TobaccoRatingController.remove);

router
  .route("/api/rating/coal")
  .post(checkAuth, upload.none(), CoalRatingController.add)
  .put(checkAuth, upload.none(), CoalRatingController.update)
  .delete(checkAuth, CoalRatingController.remove);

export { router };
