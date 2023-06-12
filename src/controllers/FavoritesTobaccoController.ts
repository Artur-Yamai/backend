import { Response, Request } from "express";
import responseHandler from "../utils/responseHandler";
import db from "../models/db";

export const addToFavoritesTobacco = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { tobaccoId } = req.body;
  const userId = req.headers.userId;
  try {
    const queryResult = await db.query(
      `
    INSERT INTO hookah.favorite_tobacco_table (user_id, tobacco_id)
    VALUES ($1, $2)
    RETURNING user_id AS "userId", tobacco_id AS "tobaccoId"
    `,
      [userId, tobaccoId]
    );

    const ft = queryResult.rows[0];

    const message = "Табак успешно добавлен в избранное";
    responseHandler.success(
      req,
      res,
      201,
      `faboriteTobaccoId - ${ft.id} : ${message}`,
      {
        success: true,
        message,
        body: ft,
      }
    );
  } catch (error: any) {
    if (error?.detail?.indexOf("already exists") > -1) {
      const message = "Этот табак уже находится у Вас в избранном";
      responseHandler.exception(
        req,
        res,
        406,
        `userId - ${userId} : попытка добавления более одного раза в избранное tobaccoId - ${tobaccoId}`,
        message
      );
      return;
    }
    responseHandler.error(req, res, error, "Табак небыл добавлен в избранное");
  }
};

export const removeToFavoritesTobacco = async (req: Request, res: Response) => {
  try {
    const tobaccoId = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(
      `
      DELETE FROM hookah.favorite_tobacco_table
      WHERE user_id = $1 AND tobacco_id = $2
      `,
      [userId, tobaccoId]
    );

    if (queryResult.rowCount) {
      const message = "Табак удален из избранного";
      responseHandler.success(
        req,
        res,
        201,
        `tobaccoId - ${tobaccoId} удален из избранного у userId - ${userId}`,
        {
          success: true,
          message,
        }
      );
    } else {
      const message = "Табак не был удален из избранного";
      responseHandler.exception(
        req,
        res,
        400,
        `tobaccoId - ${tobaccoId} не был удален из избранного у userId - ${userId}`,
        message
      );
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Табак небыл удален из избранного");
  }
};
