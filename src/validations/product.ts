import { body } from "express-validator";

export const saveProduct = [
  body("name", "Отсутствует название").notEmpty(),
  body("fabricatorId", "Отсутствует производитель").notEmpty(),
  body("description", "Отсутствует описание").notEmpty(),
];
