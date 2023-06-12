import { Request, Response } from "express";
import multer from "multer";
import db from "../models/db";
import responseHandler from "../utils/responseHandler";

const upload: multer.Multer = multer();

export const addScrore = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      responseHandler.success(req, res, 201, "msg", {
        success: true,
        message: "deleteRating",
      });
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была сохранена");
    }
  },
];

export const updateRating = [
  upload.none(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      responseHandler.success(req, res, 201, "msg", {
        success: true,
        message: "deleteRating",
      });
    } catch (error) {
      responseHandler.error(req, res, error, "Оценка не была изменена");
    }
  },
];

export const deleteRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    responseHandler.success(req, res, 201, "msg", {
      success: true,
      message: "deleteRating",
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Оценка не была удалена");
  }
};
