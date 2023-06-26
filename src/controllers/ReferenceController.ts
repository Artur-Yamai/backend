import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { v4 as uuidv4 } from "uuid";
import db, { ReferenceModels } from "../models";
import responseHandler from "../utils/responseHandler";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;

    const queryResult = await db.query(ReferenceModels.getAll(name));

    const fabricatorsList = queryResult.rows;

    const message = "Получен список производителей";
    responseHandler.success(req, res, 201, message, {
      success: true,
      message,
      body: { fabricatorsList },
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? "Такой таблицы не существует"
        : "Список производителей небыл получен";

    responseHandler.error(req, res, error, message);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    const { value } = req.body;

    const queryResult = await db.query(ReferenceModels.create(name), [
      uuidv4(),
      value,
    ]);

    const fabricator = queryResult.rows[0];

    const message = `добавлен новый производитель - ${fabricator.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message,
      body: fabricator,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? "Такой таблицы не существует"
        : "Производителей небыл создан";

    responseHandler.error(req, res, error, message);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    const { value, id } = req.body;

    const queryResult = await db.query(ReferenceModels.update(name), [
      id,
      value,
    ]);

    const fabricator = queryResult.rows[0];

    const message = `Изменен производитель - ${fabricator.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message,
      body: fabricator,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? "Такой таблицы не существует"
        : "Производитель небыл изменен";

    responseHandler.error(req, res, error, message);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    const { id } = req.body;

    const queryResult = await db.query(ReferenceModels.remove(name), [id]);

    const fabricator = queryResult.rows[0];

    const message = `Изменен производитель - ${fabricator.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Производитель удален",
      body: fabricator,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? "Такой таблицы не существует"
        : "Производитель небыл удален";

    responseHandler.error(req, res, error, message);
  }
};
