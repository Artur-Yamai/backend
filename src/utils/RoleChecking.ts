import { NextFunction, Request, Response } from "express";
import db, { UserModels } from "../models";
import responseHandler from "./responseHandler";

export enum RoleCodes {
  user = 0,
  moderator = 5,
  admin = 10,
}

export class RoleChecking {
  private static _user: RoleCodes = 0;
  private static _moderator: RoleCodes = 5;
  private static _admin: RoleCodes = 10;

  public static USER(): RoleCodes {
    return this._user;
  }

  public static MODERATOR(): RoleCodes {
    return this._moderator;
  }

  public static ADMIN(): RoleCodes {
    return this._admin;
  }

  public static rightsCheck = async (
    req: Request,
    res: Response,
    next: NextFunction,
    roleCode: RoleCodes
  ): Promise<void> => {
    try {
      const userId = req.headers.userId;

      const queryResult = await db.query(UserModels.getUserRoleCode(), [
        userId,
      ]);

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

  public static toCheckForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => this.rightsCheck(req, res, next, RoleCodes.admin);

  public static toCheckForModerator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => this.rightsCheck(req, res, next, RoleCodes.moderator);
}
