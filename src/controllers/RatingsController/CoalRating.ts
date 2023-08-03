import { Request, Response } from "express";
import multer from "multer";
import db, { RatingModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

const upload: multer.Multer = multer();

export const add = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers.userId;
      const { coalId, rating } = req.body;

      const queryResult = await db.query(RatingModels.add("coal"), [
        userId,
        coalId,
        rating,
      ]);

      if (queryResult.rowCount) {
        const message = "Оценка поставлена";
        responseHandler.success(
          req,
          res,
          201,
          `userId - ${userId} поставил coalId - ${coalId} оценку ${rating}`,
          {
            success: true,
            message,
          }
        );
      } else {
        const respMessage = "Оценка не поставлена";
        const logText = `userId - ${userId} не смог поставить coalId - ${coalId} оценку ${rating}`;
        responseHandler.notFound(req, res, logText, respMessage);
      }
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была сохранена");
    }
  },
];

export const update = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers.userId;
      const { coalId, rating } = req.body;

      const queryResult = await db.query(RatingModels.update("coal"), [
        userId,
        coalId,
        rating,
      ]);

      if (queryResult.rowCount) {
        const message = "Оценка изменена";

        responseHandler.success(
          req,
          res,
          201,
          `userId - ${userId} изменил оценку у coalId - ${coalId} на ${rating}`,
          {
            success: true,
            message,
          }
        );
      } else {
        const respMessage = "Оценка не поставлен";
        const logText = `userId - ${userId} не смог изменить оценку у coalId - ${coalId} на ${rating}`;
        responseHandler.notFound(req, res, logText, respMessage);
      }
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была изменена");
    }
  },
];

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const coalId = req.body.id;

    const queryResult = await db.query(RatingModels.remove("coal"), [
      userId,
      coalId,
    ]);

    if (queryResult.rowCount) {
      const logText = `userId - ${userId} удалил оценку к табака - ${coalId}`;
      responseHandler.forRemoved(req, res, logText);
    } else {
      const logText = `userId - ${userId} не смог удалить оценку у coalId - ${coalId}`;
      const respMessage = "Оценка не удалена";
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
