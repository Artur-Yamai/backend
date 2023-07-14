import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { v4 as uuidv4 } from "uuid";
import db, { ReferenceModels } from "../models";
import responseHandler from "../utils/responseHandler";

const tableNotExist = (name: string): string => `Таблицы ${name} не существует`;

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;

  try {
    const queryResult = await db.query(ReferenceModels.getAll(name));

    const reference = queryResult.rows;

    const message = `Получен справочник ${name}`;
    responseHandler.success(req, res, 200, message, {
      success: true,
      message: "Получен справочник",
      body: reference,
    });
  } catch (error) {
    const err = error as DatabaseError;
    if (err.code === "42P01") {
      responseHandler.notFound(req, res, err.message, tableNotExist(name));
    } else {
      responseHandler.error(
        req,
        res,
        error,
        `Справочник "${name}" небыл получен`
      );
    }
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;

  try {
    const { value } = req.body;

    const queryResult = await db.query(ReferenceModels.create(name), [
      uuidv4(),
      value,
    ]);

    const referenceItem = queryResult.rows[0];

    const message = `В справочник ${name} добавлен элемент - ${referenceItem.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Элемент справочника создан",
      body: referenceItem,
    });
  } catch (error) {
    const err = error as DatabaseError;

    if (err.code === "42P01") {
      responseHandler.notFound(req, res, err.message, tableNotExist(name));
    } else {
      responseHandler.error(
        req,
        res,
        error,
        `Новый элемент справочника "${name}" небыл создан`
      );
    }
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;
  const { value, id } = req.body;

  try {
    const queryResult = await db.query(ReferenceModels.update(name), [
      id,
      value,
    ]);

    const referenceItem = queryResult.rows[0];

    const message = `В справочнике ${name} изменен - ${referenceItem.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Элемент справочника обнавлен",
      body: referenceItem,
    });
  } catch (error) {
    const err = error as DatabaseError;

    if (err.code === "42P01") {
      responseHandler.notFound(req, res, err.message, tableNotExist(name));
    } else {
      responseHandler.error(
        req,
        res,
        error,
        `В справочнике "${name}" небыл изменен - ${id}`
      );
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;
  const { id } = req.body;

  try {
    await db.query(ReferenceModels.remove(name), [id]);

    const logText = `В справочнике ${name} удален - ${id}`;
    responseHandler.forRemoved(req, res, logText);
  } catch (error) {
    const err = error as DatabaseError;
    if (err.code === "42P01") {
      responseHandler.notFound(req, res, err.message, tableNotExist(name));
    } else {
      responseHandler.error(
        req,
        res,
        error,
        `Элемент справочника "${name}" небыл удален`
      );
    }
  }
};
