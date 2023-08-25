import { NextFunction, Request, Response } from "express";
import db, { UserModels } from "../models";
import responseHandler from "./responseHandler";

export enum RoleCodes {
  user = 0,
  moderator = 5,
  admin = 10,
}

export const rightsCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
  roleCode: RoleCodes
): Promise<void> => {
  try {
    const userId = req.headers.userId;

    const queryResult = await db.query(UserModels.getUserRoleCode(), [userId]);

    if (!queryResult.rows[0]) {
      const logText: string = `Пользователь ${userId} не обнаружен`;
      const respMessage: string = "Уровень прав доступа не обнаружен";
      return responseHandler.notFound(req, res, logText, respMessage);
    }

    const userRoleCode = queryResult.rows[0].roleCode;

    if (userRoleCode >= roleCode) {
      return next();
    }

    const exeptionText: string = `Нет доступа для userId - ${userId}`;
    const message: string = "Недостаточный уровень доступа";
    responseHandler.exception(req, res, 403, exeptionText, message);
  } catch (error) {
    responseHandler.error(req, res, error, "Ошибка поиска прав пользователя");
  }
};

export const toCheckForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => rightsCheck(req, res, next, RoleCodes.admin);
