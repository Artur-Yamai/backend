import { Router, NextFunction, Request, Response } from "express";
import { TobaccoController } from "../controllers";
import { checkAuth } from "../utils";
import RightsCheck, { RoleCodes } from "../validations/RightsCheck";
const router = Router();

router.get("/api/tobacco/:id", TobaccoController.getById);
router
  .route("/api/tobaccos")
  .get(TobaccoController.getAll)
  .post(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.moderator),
    TobaccoController.create
  )
  .put(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.moderator),
    TobaccoController.update
  )
  .delete(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      RightsCheck(req, res, next, RoleCodes.moderator),
    TobaccoController.remove
  );
router.get("/api/tobacco/:id/comments", TobaccoController.getTobaccoComments);

export { router };
