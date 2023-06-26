import { Request, Response } from "express";
import multer from "multer";
import db from "../models/db";
import responseHandler from "../utils/responseHandler";

const upload: multer.Multer = multer();

export const add = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers.userId;
      const entityId = req.body.entityId;
      const rating = req.body.rating;

      const queryResult = await db.query(
        `
        INSERT INTO hookah.rating_table (
          user_id, entity_id, rating
        ) VALUES ($1, $2, $3)
        RETURNING rating
        `,
        [userId, entityId, rating]
      );

      if (queryResult.rowCount) {
        const message = "Оценка поставлен";
        responseHandler.success(
          req,
          res,
          201,
          `userId - ${userId} поставил entityId - ${entityId} оценку ${rating}`,
          {
            success: true,
            message,
          }
        );
      } else {
        const message = "Оценка не поставлен";
        responseHandler.exception(
          req,
          res,
          400,
          `userId - ${userId} не смог поставить entityId - ${entityId} оценку ${rating}`,
          message
        );
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
      const entityId = req.body.entityId;
      const rating = req.body.rating;

      const queryResult = await db.query(
        `
      UPDATE
        hookah.rating_table
      SET
        rating = $3
      WHERE
        user_id = $1 AND entity_id = $2
      `,
        [userId, entityId, rating]
      );

      if (queryResult.rowCount) {
        const message = "Оценка изменена";

        responseHandler.success(
          req,
          res,
          201,
          `userId - ${userId} изменил оценку у entityId - ${entityId} на ${rating}`,
          {
            success: true,
            message,
          }
        );
      } else {
        const message = "Оценка не поставлен";
        responseHandler.exception(
          req,
          res,
          400,
          `userId - ${userId} не смог изменить оценку у entityId - ${entityId} на ${rating}`,
          message
        );
      }
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была изменена");
    }
  },
];

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const entityId = req.body.id;

    const queryResult = await db.query(
      `
        DELETE FROM hookah.rating_table
        WHERE user_id = $1 AND entity_id = $2
      `,
      [userId, entityId]
    );

    if (queryResult.rowCount) {
      const message = "Оценка удалена";
      responseHandler.success(
        req,
        res,
        201,
        `userId - ${userId} удалил оценку к entityId - ${entityId}`,
        {
          success: true,
          message,
        }
      );
    } else {
      const message = "Оценка не удалена";
      responseHandler.success(
        req,
        res,
        201,
        `userId - ${userId} не смог удалить оценку к entityId - ${entityId}`,
        {
          success: true,
          message,
        }
      );
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
