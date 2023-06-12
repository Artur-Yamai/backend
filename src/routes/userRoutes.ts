import { Router } from "express";
import { registerValidation, loginValidation } from "../validations";
import multer from "multer";
import { UserController } from "../controllers";

import { handleValidationErrors, checkAuth } from "../utils";

const router = Router();

router.post(
  "/api/user/register",
  multer().none(),
  registerValidation,
  handleValidationErrors,
  UserController.register
);
router.post(
  "/api/user/auth",
  multer().none(),
  loginValidation,
  handleValidationErrors,
  UserController.auth
);
router.get("/api/user/authByToken", checkAuth, UserController.authById);
router.put("/api/user/saveAvatar", checkAuth, UserController.saveAvatar);

router.get("/api/user/loginExists/:login", UserController.loginExists);
router.get("/api/user/emailExists/:email", UserController.emailExists);

router.get("/api/user/:id", UserController.getUserById);

// router.get("/api/user/:id/comments", UserController.getUserComments);

router.get(
  "/api/user/:id/favoriteTobaccos",
  UserController.getFavoritesTobaccoByUserId
);

export { router };
