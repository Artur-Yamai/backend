import { Router } from "express";
import multer from "multer";
import { checkAuth } from "../utils";
import {
  FavoritesTobaccoController,
  FavoritesCoalController,
} from "../controllers";

const router = Router();

const upload: multer.Multer = multer();

router
  .route("/api/favorite/tobacco")
  .post(checkAuth, upload.none(), FavoritesTobaccoController.add)
  .delete(checkAuth, FavoritesTobaccoController.remove);

router
  .route("/api/favorite/coal")
  .post(checkAuth, upload.none(), FavoritesCoalController.add)
  .delete(checkAuth, FavoritesCoalController.remove);

export { router };
