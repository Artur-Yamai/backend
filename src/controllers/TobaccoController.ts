import { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { tobaccoDirName } from "../constants";
import { fileFilter } from "../utils";
import db, { TobaccoModels } from "../models";
import responseHandler from "../utils/responseHandler";
import { tokenDecoded } from "../helpers";
import logger from "../logger/logger.service";

const storage: multer.StorageEngine = multer.diskStorage({
  destination: tobaccoDirName,
  filename: (_, file, cb) => {
    const params: string[] = file.originalname.split(".");
    const newPhotoName: string = uuidv4() + "." + params[params.length - 1];
    cb(null, newPhotoName);
  },
});

const upload: multer.Multer = multer({
  storage,
  fileFilter: fileFilter(["image/png", "image/jpeg", "image/jpg"]),
});

export const create = [
  upload.single("photo"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const userId = req.headers.userId;
      const fileName: string | undefined = req.file?.filename;

      if (!fileName) {
        const message: string = "Фотография не подходят по формату";
        responseHandler.exception(
          req,
          res,
          403,
          `userId - ${userId}: ${message}`,
          message
        );
        return;
      }

      const { name, fabricatorId, description } = body;

      const queryResult = await db.query(TobaccoModels.create(), [
        uuidv4(),
        name,
        fabricatorId,
        description,
        userId,
        `uploads/tobaccos/${fileName}`,
      ]);

      const tobacco = queryResult.rows[0].id;

      const message: string = "Новый табак сохранен";
      responseHandler.success(
        req,
        res,
        201,
        `tobaccoId - ${tobacco.id} : ${message}`,
        {
          success: true,
          message,
          body: { id: tobacco.id },
        }
      );
    } catch (error) {
      responseHandler.error(req, res, error, "Табак не был создан");
    }
  },
];

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryResult = await db.query(TobaccoModels.getAll());

    const tobaccos = queryResult.rows;

    responseHandler.success(req, res, 201, "Получен список всех табаков", {
      success: true,
      body: tobaccos,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Табаки небыли получены");
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tobaccoId = req.params.id;

    const userId: string = ((): string => {
      const token: string | undefined = req.headers.authorization;
      if (token) {
        const data = tokenDecoded(token);
        if (typeof data !== "string") {
          return data.id;
        }
      }
      return "";
    })();

    const queryResult = await db.query(TobaccoModels.getById(), [
      tobaccoId,
      userId,
    ]);

    const tobacco = queryResult.rows[0];

    if (!tobacco) {
      const message: string = "Данные отстуствуют";

      responseHandler.exception(
        req,
        res,
        404,
        `tobaccoId - ${tobaccoId} : ${message}`,
        message
      );
      return;
    }

    responseHandler.success(req, res, 200, `tobaccoId - ${tobaccoId}`, {
      success: true,
      body: tobacco,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Табак не был получен");
  }
};

export const update = [
  upload.single("photo"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      let oldPhotoUrl: string = "";
      const fileName: string | undefined = req.file?.filename;
      const userId = req.headers.userId;

      const { name, fabricatorId, description, id } = req.body;
      console.log(fabricatorId);

      if (fileName) {
        const queryResult = await db.query(TobaccoModels.getOldPhotoUrl(), [
          id,
        ]);
        oldPhotoUrl = queryResult.rows[0].photoUrl;
      }

      const queryResult = await db.query(TobaccoModels.update(), [
        name, // $1
        fabricatorId, // $2
        description, // $3
        fileName ? `uploads/tobaccos/${fileName}` : fileName, // $4
        id, // $5
        userId, // $6
      ]);

      const tobacco = queryResult.rows[0];

      if (!tobacco) {
        const message = "табак не найден";
        responseHandler.exception(
          req,
          res,
          404,
          `tobaccoId "${id}" - не найден`,
          message
        );
        return;
      }

      if (oldPhotoUrl) {
        const path = "./dist/" + oldPhotoUrl;
        fs.unlink(path, (err) => {
          if (err) logger.error(err.message);
        });
      }

      responseHandler.success(
        req,
        res,
        200,
        `userId - ${userId} updated tobaccoId - ${id}`,
        {
          success: true,
          message: "Табак успешно обновлен",
          body: tobacco,
        }
      );
    } catch (error) {
      responseHandler.error(req, res, error, "Табак не был обновлен");
    }
  },
];

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(TobaccoModels.remove(), [id]);

    const tobacco = queryResult.rows[0];

    if (!tobacco) {
      const message = "Такого табака нет";
      responseHandler.exception(
        req,
        res,
        404,
        `tobaccoId - ${id} - ${message}`,
        message
      );
      return;
    }

    responseHandler.success(
      req,
      res,
      200,
      `userId - ${userId} deleted tobaccoId - ${id}`,
      {
        success: true,
        message: "Табак удален",
      }
    );
  } catch (error) {
    responseHandler.error(req, res, error, "Табак не был удален");
  }
};

export const getTobaccoComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tobaccoId = req.params.id;
    console.log(tobaccoId);

    const queryResult = await db.query(TobaccoModels.getTobaccoComments(), [
      tobaccoId,
    ]);

    const comments = queryResult.rows;

    const message: string = "Получен список комментариев";
    responseHandler.success(req, res, 201, ``, {
      success: true,
      message,
      body: comments,
    });
  } catch (error) {
    responseHandler.error(
      req,
      res,
      error,
      "Комментарии табака не были получены"
    );
  }
};
