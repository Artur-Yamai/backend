import { Router, NextFunction, Request, Response } from "express";
import multer from "multer";
import { checkAuth } from "../utils";
import { ReferenceController } from "../controllers";
import RightsCheck, { RoleCodes } from "../validations/RightsCheck";

const router = Router();
const upload: multer.Multer = multer();

router
  .route("/api/reference/:name")
  .get(checkAuth, ReferenceController.getAll)
  .post(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.admin),
    upload.none(),
    ReferenceController.create
  )
  .put(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.admin),
    upload.none(),
    ReferenceController.update
  )
  .delete(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.admin),
    ReferenceController.remove
  );

export { router };
