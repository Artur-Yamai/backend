import { Router, NextFunction, Request, Response } from "express";
import { RoleCodes, checkAuth, rightsCheck } from "../utils";
import { CoalController } from "../controllers";
const router = Router();

router.get("/api/coal/:id", CoalController.getById);

router
  .route("/api/coals")
  .get(CoalController.getAll)
  .post(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      rightsCheck(req, res, next, RoleCodes.moderator),
    CoalController.create
  )
  .put(
    checkAuth,
    (req: Request, res: Response, next: NextFunction) =>
      rightsCheck(req, res, next, RoleCodes.moderator),
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
