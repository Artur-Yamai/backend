import { Router } from "express";
import multer from "multer";
import { RoleChecking, checkAuth } from "../utils";
import { ReferenceController } from "../controllers";

const router = Router();
const upload: multer.Multer = multer();

router
  .route("/api/reference/:name")
  .get(checkAuth, ReferenceController.getAll)
  .post(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.none(),
    ReferenceController.create
  )
  .put(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.none(),
    ReferenceController.update
  )
  .delete(
    checkAuth,
    RoleChecking.toCheckForModerator,
    ReferenceController.remove
  );

export { router };
