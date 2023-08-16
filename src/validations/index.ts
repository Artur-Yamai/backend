import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("login", "Логин должен содержать от 4 до 30 символов").isLength({
    min: 4,
    max: 30,
  }),
  body("refCode", "Для регистрации необходим реферальный код").notEmpty(),
];

export const loginValidation = [
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];
