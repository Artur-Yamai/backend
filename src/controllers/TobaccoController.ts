import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { tobaccoDirName } from "../constants";
import db, { TobaccoModels } from "../models";
import responseHandler from "../utils/responseHandler";
import { getUserIdFromToken } from "../helpers";
import logger from "../logger/logger.service";
import { createFileUploader } from "../utils";

const upload = createFileUploader(tobaccoDirName);

export const create = [
  upload.single("photo"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const userId = req.headers.userId;
      const fileName: string | undefined = req.file?.filename;

      if (!fileName) {
        const message: string =
          "Фотография не подходят по формату или отсутсвует";
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

      const tobaccoId = queryResult.rows[0].id;

      const message: string = "Новый табак сохранен";
      responseHandler.success(
        req,
        res,
        201,
        `tobaccoId - ${tobaccoId} : ${message}`,
        {
          success: true,
          message,
          body: { id: tobaccoId },
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

    const userId: string | null = getUserIdFromToken(req.headers.authorization);

    const queryResult = await db.query(TobaccoModels.getById(), [
      tobaccoId,
      userId,
    ]);

    const tobacco = queryResult.rows[0];

    if (!tobacco) {
      const respMessage: string = "Данные отстуствуют";
      const logText: string = `tobaccoId - ${tobaccoId} : ${respMessage}`;
      return responseHandler.notFound(req, res, logText, respMessage);
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
        const logText = `tobaccoId "${id}" - не найден`;
        const respMessage = "табак не найден";
        return responseHandler.notFound(req, res, logText, respMessage);
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
      const respMessage = "Такого табака нет";
      const logText = `tobaccoId - ${id} - ${respMessage}`;
      return responseHandler.notFound(req, res, logText, respMessage);
    }

    await db.query(TobaccoModels.saveDeletedTobacco(), [
      uuidv4(),
      tobacco.tobacco_id,
      tobacco.tobacco_name,
      tobacco.fabricator_id,
      tobacco.tobacco_description,
      tobacco.photo_url,
      tobacco.user_id,
      tobacco.created_at,
      tobacco.updated_at,
    ]);

    const logText = `userId - ${userId} deleted tobaccoId - ${id}`;
    responseHandler.forRemoved(req, res, logText);
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
