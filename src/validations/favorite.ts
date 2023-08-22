import { body } from "express-validator";
import { handleValidationErrors } from "../utils";

// длинна строки uuid
const uuidLengthOpt = { min: 36, max: 36 };

export const saveFavoriteTobacco = [
  body("tobaccoId", "Табак не выбран").isLength(uuidLengthOpt),
  handleValidationErrors,
];

export const saveFavoriteCoal = [
  body("coalId", "Уголь не выбран").isLength(uuidLengthOpt),
  handleValidationErrors,
];
