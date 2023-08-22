import { body } from "express-validator";

export const login = [
  body("login", "Логин должен содержать от 4 до 30 символов").isLength({
    min: 4,
    max: 30,
  }),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const register = [
  ...login,
  body("email", "Неверный формат почты").isEmail(),
  body("refCode", "Для регистрации необходим реферальный код").notEmpty(),
];
