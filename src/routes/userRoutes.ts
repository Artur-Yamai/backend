import { Router } from "express";
import validations from "../validations";
import multer from "multer";
import { UserController } from "../controllers";
import { avatarsDirName } from "../constants";
import {
  createFileUploader,
  handleValidationErrors,
  checkAuth,
} from "../utils";

const router = Router();

const upload: multer.Multer = multer();
const avatarUpload = createFileUploader(avatarsDirName);

router.post(
  "/api/user/register",
  upload.none(),
  validations.register,
  handleValidationErrors,
  UserController.register
);
router.post(
  "/api/user/auth",
  upload.none(),
  validations.login,
  handleValidationErrors,
  UserController.auth
);
router.get("/api/user/authByToken", checkAuth, UserController.authById);
router.put(
  "/api/user/saveAvatar",
  checkAuth,
  avatarUpload.single("photo"),
  UserController.saveAvatar
);
router.put(
  "/api/user/updatePassword",
  checkAuth,
  upload.none(),
  UserController.updatePassword
);

router.post(
  "/api/user/restorePassword",
  upload.none(),
  UserController.sendNewPasswordByEmail
);

router.get("/api/user/loginExists/:login", UserController.loginExists);
router.get("/api/user/emailExists/:email", UserController.emailExists);
router.get("/api/user/refCodeExists/:refCode", UserController.refCodeExist);

router.get("/api/user/:id", UserController.getUserById);

// router.get("/api/user/:id/comments", UserController.getUserComments);

router.get(
  "/api/user/:id/favoriteTobaccos",
  UserController.getFavoritesTobaccoByUserId
);

router.get(
  "/api/user/:id/favoriteCoals",
  UserController.getFavoritesCoalByUserId
);

export { router };
