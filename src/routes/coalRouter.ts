import { Router, NextFunction, Request, Response } from "express";
import { rightsCheck, RoleCodes, checkAuth } from "../utils";
import { CoalController } from "../controllers";
import validations from "../validations";
import { createFileUploader } from "../utils";
import { coalDirName } from "../constants";

const router = Router();

const upload = createFileUploader(coalDirName);

router.get("/api/coal/:id", CoalController.getById);

router
  .route("/api/coals")
  .get(CoalController.getAll)
  .post(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      rightsCheck(req, res, next, RoleCodes.moderator),
    upload.single("photo"),
    validations.saveProduct,
    CoalController.create
  )
  .put(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      rightsCheck(req, res, next, RoleCodes.moderator),
    upload.single("photo"),
    validations.saveProduct,
    CoalController.update
  )
  .delete(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      rightsCheck(req, res, next, RoleCodes.moderator),
    CoalController.remove
  );

router.get("/api/coal/:id/comments", CoalController.getCoalComments);

export { router };
