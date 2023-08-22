import { body } from "express-validator";
import { handleValidationErrors } from "../utils";
import { uuidLengthOpt } from "../constants";

export const saveTobaccoRating = [
  body("tobaccoId", "Оценивыемый табак не выбрана").isLength(uuidLengthOpt),
  body(
    "rating",
    "Оценка отсутсвует или выбрана вне пределах диапозона"
  ).isNumeric(),
  handleValidationErrors,
];

export const saveCoalRating = [
  body("coalId", "Оценивыемый табак не выбрана").isLength(uuidLengthOpt),
  body(
    "rating",
    "Оценка отсутсвует или выбрана вне пределах диапозона"
  ).isNumeric(),
  handleValidationErrors,
];
