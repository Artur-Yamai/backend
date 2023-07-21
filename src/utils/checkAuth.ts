import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import responseHandler from "./responseHandler";
import { tokenDecoded } from "../helpers";

export default (req: Request, res: Response, next: NextFunction) => {
  const noAccessFunc = (token: string | jwt.JwtPayload) => {
    responseHandler.exception(
      req,
      res,
      403,
      `Нет доступа: token - ${token}`,
      "Нет доступа"
    );
  };

  if (!req.headers.authorization) {
    return noAccessFunc("");
  }

  const data: jwt.JwtPayload | string = tokenDecoded(req.headers.authorization);

  if (typeof data !== "string") {
    req.headers.userId = data.id;
    next();
    return;
  } else {
    return noAccessFunc(data);
  }
};
