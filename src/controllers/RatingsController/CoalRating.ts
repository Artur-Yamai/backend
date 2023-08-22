import { Request, Response } from "express";
import db, { RatingModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

export const add = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const { coalId, rating } = req.body;

    const queryResult = await db.query(RatingModels.add("coal"), [
      userId,
      coalId,
      rating,
    ]);

    if (queryResult.rowCount) {
      const message: string = "Оценка поставлена";
      const logText: string = `userId - ${userId} поставил coalId - ${coalId} оценку ${rating}`;
      responseHandler.success(req, res, 201, logText, {
        success: true,
        message,
      });
    } else {
      const respMessage: string = "Оценка не поставлена";
      const logText: string = `userId - ${userId} не смог поставить coalId - ${coalId} оценку ${rating}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была сохранена");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const { coalId, rating } = req.body;

    const queryResult = await db.query(RatingModels.update("coal"), [
      userId,
      coalId,
      rating,
    ]);

    if (queryResult.rowCount) {
      const message: string = "Оценка изменена";
      const logText: string = `userId - ${userId} изменил оценку у coalId - ${coalId} на ${rating}`;

      responseHandler.success(req, res, 201, logText, {
        success: true,
        message,
      });
    } else {
      const respMessage: string = "Оценка не поставлен";
      const logText: string = `userId - ${userId} не смог изменить оценку у coalId - ${coalId} на ${rating}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была изменена");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const coalId = req.body.id;

    const queryResult = await db.query(RatingModels.remove("coal"), [
      userId,
      coalId,
    ]);

    if (queryResult.rowCount) {
      const logText: string = `userId - ${userId} удалил оценку к табака - ${coalId}`;
      responseHandler.forRemoved(req, res, logText);
    } else {
      const logText: string = `userId - ${userId} не смог удалить оценку у coalId - ${coalId}`;
      const respMessage: string = "Оценка не удалена";
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
