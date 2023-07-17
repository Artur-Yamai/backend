import { Router } from "express";
import { TobaccoRatingController } from "../controllers";
import { checkAuth } from "../utils";

const router = Router();

router
  .route("/api/rating/tobacco")
  .post(checkAuth, TobaccoRatingController.add)
  .put(checkAuth, TobaccoRatingController.update)
  .delete(checkAuth, TobaccoRatingController.remove);

export { router };
