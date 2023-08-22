import { Request, Response } from "express";
import db, { RatingModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

export const add = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const { tobaccoId, rating } = req.body;

    const queryResult = await db.query(RatingModels.add("tobacco"), [
      userId,
      tobaccoId,
      rating,
    ]);

    if (queryResult.rowCount) {
      const message: string = "Оценка поставлена";
      const logText: string = `userId - ${userId} поставил tobaccoId - ${tobaccoId} оценку ${rating}`;
      responseHandler.success(req, res, 201, logText, {
        success: true,
        message,
      });
    } else {
      const respMessage: string = "Оценка не поставлена";
      const logText: string = `userId - ${userId} не смог поставить tobaccoId - ${tobaccoId} оценку ${rating}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была сохранена");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const { tobaccoId, rating } = req.body;

    const queryResult = await db.query(RatingModels.update("tobacco"), [
      userId,
      tobaccoId,
      rating,
    ]);

    if (queryResult.rowCount) {
      const message: string = "Оценка изменена";
      const logText: string = `userId - ${userId} изменил оценку у coalId - ${tobaccoId} на ${rating}`;

      responseHandler.success(req, res, 201, logText, {
        success: true,
        message,
      });
    } else {
      const respMessage: string = "Оценка не поставлена";
      const logText: string = `userId - ${userId} не смог изменить оценку у tobaccoId - ${tobaccoId} на ${rating}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была изменена");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const tobaccoId = req.body.id;

    const queryResult = await db.query(RatingModels.remove("tobacco"), [
      userId,
      tobaccoId,
    ]);

    if (queryResult.rowCount) {
      const logText: string = `userId - ${userId} удалил оценку к табака - ${tobaccoId}`;
      responseHandler.forRemoved(req, res, logText);
    } else {
      const logText: string = `userId - ${userId} не смог удалить оценку у tobaccoId - ${tobaccoId}`;
      const respMessage: string = "Оценка не удалена";
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
