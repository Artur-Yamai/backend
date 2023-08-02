import { Request, Response } from "express";
import multer from "multer";
import responseHandler from "../../utils/responseHandler";

const upload: multer.Multer = multer();

export const add = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers.userId;
      const { coalId, rating } = req.body;

      res.json({ userId, coalId, rating });
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

      res.json({ userId, coalId, rating });
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была изменена");
    }
  },
];

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userId;
    const coalId = req.body.id;

    res.json({ userId, coalId });
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
