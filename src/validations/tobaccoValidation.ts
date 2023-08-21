import { body } from "express-validator";

export const saveTobaccoValidation = [
  body("name", "У табака отсутствует название").notEmpty(),
  body("fabricatorId", "У табака отсутствует производитель").notEmpty(),
  body("description", "У табака отсутствует описание").notEmpty(),
];
