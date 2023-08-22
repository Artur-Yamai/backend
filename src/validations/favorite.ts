import { body } from "express-validator";
import { handleValidationErrors } from "../utils";
import { uuidLengthOpt } from "../constants";

export const saveFavoriteTobacco = [
  body("tobaccoId", "Табак не выбран").isLength(uuidLengthOpt),
  handleValidationErrors,
];

export const saveFavoriteCoal = [
  body("coalId", "Уголь не выбран").isLength(uuidLengthOpt),
  handleValidationErrors,
];
