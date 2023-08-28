import { Router } from "express";
import { TobaccoController } from "../controllers";
import { RoleChecking, checkAuth, createFileUploader } from "../utils";
import validations from "../validations";
import { tobaccoDirName } from "../constants";
const router = Router();

const upload = createFileUploader(tobaccoDirName);

router.get("/api/tobacco/:id", TobaccoController.getById);
router
  .route("/api/tobaccos")
  .get(TobaccoController.getAll)
  .post(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.single("photo"),
    validations.saveProduct,
    TobaccoController.create
  )
  .put(
    checkAuth,
    RoleChecking.toCheckForModerator,
    upload.single("photo"),
    validations.saveProduct,
    TobaccoController.update
  )
  .delete(
    checkAuth,
    RoleChecking.toCheckForModerator,
    TobaccoController.remove
  );
router.get("/api/tobacco/:id/comments", TobaccoController.getTobaccoComments);

export { router };
