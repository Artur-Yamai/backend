import { Response, Request } from "express";
import responseHandler from "../../utils/responseHandler";

export const add = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coalId } = req.body;
    const userId = req.headers.userId;

    res.json({
      coalId,
      userId,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Уголь небыл добавлен в избранное");
  }
};
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const coalId = req.body.id;
    const userId = req.headers.userId;
    res.json({
      coalId,
      userId,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Уголь небыл удален из избранного");
  }
};
