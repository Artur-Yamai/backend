import { Router, Response, Request, NextFunction } from "express";
import multer from "multer";
import { handleValidationErrors, checkAuth } from "../utils";
import { FavoritesTobaccoController } from "../controllers";

const router = Router();

router
  .route("/api/favoriteTobacco")
  .post(
    checkAuth,
    multer().none(),
    FavoritesTobaccoController.addToFavoritesTobacco
  )
  .delete(checkAuth, FavoritesTobaccoController.removeToFavoritesTobacco);

export { router };
