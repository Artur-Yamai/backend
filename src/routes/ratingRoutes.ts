import { Router } from "express";
import { RatingController } from "../controllers";
import { checkAuth } from "../utils";

const router = Router();

router
  .route("/api/rating")
  .post(checkAuth, RatingController.addScrore)
  .put(checkAuth, RatingController.updateRating)
  .delete(checkAuth, RatingController.deleteRating);

export { router };
