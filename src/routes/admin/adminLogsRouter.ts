import { Router } from "express";
import { checkAuth, RoleChecking } from "../../utils";
import { LogController } from "../../controllers";

const router = Router();

router.get(
  "/api/admin/logs",
  checkAuth,
  RoleChecking.toCheckForAdmin,
  LogController.getLogs
);

export { router };
