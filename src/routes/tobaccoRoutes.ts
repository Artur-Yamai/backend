import { Router } from "express";
import { TobaccoController } from "../controllers";
import { checkAuth } from "../utils";
const router = Router();

router.get("/api/tobacco/:id", TobaccoController.getById);
router
  .route("/api/tobaccos")
  .get(TobaccoController.getAll)
  .post(checkAuth, TobaccoController.create)
  .put(checkAuth, TobaccoController.update)
  .delete(checkAuth, TobaccoController.remove);
router.get("/api/tobacco/:id/comments", TobaccoController.getTobaccoComments);

export { router };
