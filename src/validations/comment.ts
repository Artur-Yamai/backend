import { body } from "express-validator";
import { handleValidationErrors } from "../utils";

const text = body(
  "text",
  "Текст комментария должен сожержать от 10 до 256 символов"
).isLength({ min: 10, max: 256 });

export const saveCoalComment = [
  text,
  body("coalId", "Отсутствует id комментируемого угля").isLength({
    // длинна строки uuid
    min: 36,
    max: 36,
  }),
  handleValidationErrors,
];

export const saveTobaccoComment = [
  text,
  body("tobaccoId", "Отсутствует id комментируемого табака").isLength({
    // длинна строки uuid
    min: 36,
    max: 36,
  }),
  handleValidationErrors,
];
