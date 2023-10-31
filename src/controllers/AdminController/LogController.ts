import fs from "fs";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";

export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const message: string = "Логи получены";
    const logs = fs.readFileSync("pino-logger.log", "utf8");
    const body = { success: true, message, body: logs };
    responseHandler.success(req, res, 200, message, body);
  } catch (error) {
    responseHandler.error(req, res, error, "Ошибка получения логов");
  }
};
