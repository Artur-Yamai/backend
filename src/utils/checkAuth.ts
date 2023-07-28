import { Request, Response, NextFunction } from "express";
import responseHandler from "./responseHandler";
import { getUserIdFromToken } from "../helpers";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const noAccessFunc = (token: string | null): void => {
    const msg: string = "Нет доступа";
    responseHandler.exception(req, res, 403, `${msg}: token - ${token}`, msg);
  };

  if (!token) return noAccessFunc(`${token}`);

  const userId: string | null = getUserIdFromToken(token);

  if (!userId) return noAccessFunc(token);

  req.headers.userId = userId;
  next();
};
