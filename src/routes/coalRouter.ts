import { Router, NextFunction, Request, Response } from "express";
import {
  RoleChecking,
  RoleCodes,
  checkAuth,
  createFileUploader,
} from "../utils";
import { CoalController } from "../controllers";
import validations from "../validations";
import { coalDirName } from "../constants";

const router = Router();

const upload = createFileUploader(coalDirName);

router.get("/api/coal/:id", CoalController.getById);

router
  .route("/api/coals")
  .get(CoalController.getAll)
  .post(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.single("photo"),
    validations.saveProduct,
    CoalController.create
  )
  .put(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.single("photo"),
    validations.saveProduct,
    CoalController.update
  )
  .delete(checkAuth, RoleChecking.toCheckForModerator, CoalController.remove);

router.get("/api/coal/:id/comments", CoalController.getCoalComments);

export { router };
