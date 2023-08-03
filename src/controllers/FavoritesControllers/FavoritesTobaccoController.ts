import { Response, Request } from "express";
import db, { FavoritesModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

export const add = async (req: Request, res: Response): Promise<void> => {
  const { tobaccoId } = req.body;
  const userId = req.headers.userId;
  try {
    const queryResult = await db.query(FavoritesModels.add("tobacco"), [
      userId,
      tobaccoId,
    ]);

    const favorite = queryResult.rows[0];

    const message = "Табак успешно добавлен в избранное";
    responseHandler.success(
      req,
      res,
      201,
      `faboriteTobaccoId - ${favorite.tobaccoId} : ${message}`,
      {
        success: true,
        message,
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

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const tobaccoId = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(FavoritesModels.remove("tobacco"), [
      userId,
      tobaccoId,
    ]);

    if (queryResult.rowCount) {
      const logText = `tobaccoId - ${tobaccoId} удален из избранного у userId - ${userId}`;
      responseHandler.forRemoved(req, res, logText);
    } else {
      const respMessage = "Табак не был удален из избранного";
      const logText = `tobaccoId - ${tobaccoId} не был удален из избранного у userId - ${userId}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Табак небыл удален из избранного");
  }
};
