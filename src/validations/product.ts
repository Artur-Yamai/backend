import { body } from "express-validator";
import { handleValidationErrors } from "../utils";
import { uuidLengthOpt } from "../constants";

export const saveProduct = [
  body("name", "Отсутствует название").notEmpty(),
  body("fabricatorId", "Отсутствует производитель").isLength(uuidLengthOpt),
  body("description", "Отсутствует описание").notEmpty(),
  handleValidationErrors,
];
