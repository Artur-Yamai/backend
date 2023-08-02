import { Router } from "express";
import { TobaccoRatingController, CoalRatingController } from "../controllers";
import { checkAuth } from "../utils";

const router = Router();

router
  .route("/api/rating/tobacco")
  .post(checkAuth, TobaccoRatingController.add)
  .put(checkAuth, TobaccoRatingController.update)
  .delete(checkAuth, TobaccoRatingController.remove);

router
  .route("/api/rating/coal")
  .post(checkAuth, CoalRatingController.add)
  .put(checkAuth, CoalRatingController.update)
  .delete(checkAuth, CoalRatingController.remove);

export { router };
