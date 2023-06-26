import { Router } from "express";
import multer from "multer";
import { checkAuth } from "../utils";
import { ReferenceController } from "../controllers";

const router = Router();
const upload: multer.Multer = multer();

router
  .route("/api/reference/:name")
  .get(checkAuth, ReferenceController.getAll)
  .post(checkAuth, upload.none(), ReferenceController.create)
  .put(checkAuth, upload.none(), ReferenceController.update)
  .delete(checkAuth, ReferenceController.remove);

export { router };
