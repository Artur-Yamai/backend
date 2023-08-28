import { Router } from "express";
import multer from "multer";
import { checkAuth, RoleChecking } from "../../utils";
import { UserController } from "../../controllers";

const router = Router();
const upload: multer.Multer = multer();

router.get(
  "/api/admin/user/authByToken",
  checkAuth,
  RoleChecking.toCheckForAdmin,
  UserController.authById
);

router.get(
  "/api/admin/userlist",
  checkAuth,
  RoleChecking.toCheckForAdmin,
  UserController.getListByAllUsers
);

router.put(
  "/api/admin/user/setRole",
  checkAuth,
  RoleChecking.toCheckForAdmin,
  upload.none(),
  UserController.setRole
);

export { router };
