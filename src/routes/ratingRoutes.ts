import { Router } from "express";
import { RatingController } from "../controllers";
import { checkAuth } from "../utils";

const router = Router();

router
  .route("/api/rating")
  .post(checkAuth, RatingController.add)
  .put(checkAuth, RatingController.update)
  .delete(checkAuth, RatingController.remove);

export { router };
