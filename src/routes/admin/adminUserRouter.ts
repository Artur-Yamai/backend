import { Router } from "express";
import { checkAuth } from "../../utils";
import { UserController } from "../../controllers";
import { toCheckForAdmin } from "../../utils/RightsCheck";

const router = Router();

router.get(
  "/api/admin/user/authByToken",
  checkAuth,
  toCheckForAdmin,
  UserController.authById
);

export { router };
