import { Response, Request } from "express";
import db, { FavoritesModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

export const add = async (req: Request, res: Response): Promise<void> => {
  const { coalId } = req.body;
  console.log(coalId);
  const userId = req.headers.userId;

  try {
    const queryResult = await db.query(FavoritesModels.add("coal"), [
      userId,
      coalId,
    ]);

    const favorite = queryResult.rows[0];

    const message = "Уголь успешно добавлен в избранное";
    responseHandler.success(
      req,
      res,
      201,
      `coalId - ${favorite.coalId} : ${message}`,
      { success: true, message }
    );
  } catch (error: any) {
    if (error?.detail?.indexOf("already exists") > -1) {
      const message = "Этот уголь уже находится у Вас в избранном";
      responseHandler.exception(
        req,
        res,
        406,
        `userId - ${userId} : попытка добавления более одного раза в избранное coalId - ${coalId}`,
        message
      );
      return;
    }
    responseHandler.error(req, res, error, "Уголь небыл добавлен в избранное");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const coalId = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(FavoritesModels.remove("coal"), [
      userId,
      coalId,
    ]);

    if (queryResult.rowCount) {
      const logText = `coalId - ${coalId} удален из избранного у userId - ${userId}`;
      responseHandler.forRemoved(req, res, logText);
    } else {
      const respMessage = "Уголь не был удален из избранного";
      const logText = `coalId - ${coalId} не был удален из избранного у userId - ${userId}`;
      responseHandler.notFound(req, res, logText, respMessage);
    }
  } catch (error) {
    responseHandler.error(req, res, error, "Уголь небыл удален из избранного");
  }
};
