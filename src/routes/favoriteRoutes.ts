import { Router, Response, Request, NextFunction } from "express";
import multer from "multer";
import { checkAuth } from "../utils";
import {
  FavoritesTobaccoController,
  FavoritesCoalController,
} from "../controllers";

const router = Router();

router
  .route("/api/favorite/tobacco")
  .post(
    checkAuth,
    multer().none(),
    FavoritesTobaccoController.addToFavoritesTobacco
  )
  .delete(checkAuth, FavoritesTobaccoController.removeToFavoritesTobacco);

export { router };
