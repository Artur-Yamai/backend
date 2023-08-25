import { Router } from "express";
import { checkAuth, RoleChecking } from "../../utils";
import { UserController } from "../../controllers";

const router = Router();

router.get(
  "/api/admin/user/authByToken",
  checkAuth,
  RoleChecking.toCheckForAdmin,
  UserController.authById
);

export { router };
