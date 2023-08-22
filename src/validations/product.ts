import { body } from "express-validator";
import { handleValidationErrors } from "../utils";

export const saveProduct = [
  body("name", "Отсутствует название").notEmpty(),
  body("fabricatorId", "Отсутствует производитель").notEmpty(),
  body("description", "Отсутствует описание").notEmpty(),
  handleValidationErrors,
];
