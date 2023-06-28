import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { v4 as uuidv4 } from "uuid";
import db, { ReferenceModels } from "../models";
import responseHandler from "../utils/responseHandler";

const tableNotExist = (name: string): string =>
  `Таблицы ${name}_table не существует`;

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;

  try {
    const queryResult = await db.query(ReferenceModels.getAll(name));

    const reference = queryResult.rows;

    const message = `Получен справочник ${name}_table`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Получен справочник",
      body: reference,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01" ? tableNotExist(name) : "Справочник небыл получен";

    responseHandler.error(req, res, error, message);
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

    const message = `В справочник ${name}_table добавлен элемент - ${referenceItem.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Элемент справочника создан",
      body: referenceItem,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? tableNotExist(name)
        : `Новый элемент справочника "${name}_table" небыл создан`;

    responseHandler.error(req, res, error, message);
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

    const message = `В справочнике ${name}_table изменен - ${referenceItem.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Элемент справочника обнавлен",
      body: referenceItem,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? tableNotExist(name)
        : `В справочнике "${name}_table" небыл изменен - ${id}`;

    responseHandler.error(req, res, error, message);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;
  const { id } = req.body;

  try {
    const queryResult = await db.query(ReferenceModels.remove(name), [id]);

    const referenceItem = queryResult.rows[0];

    const message = `В справочнике ${name}_table удален - ${referenceItem.id}`;
    responseHandler.success(req, res, 201, message, {
      success: true,
      message: "Элемент справочника удален",
      body: referenceItem,
    });
  } catch (error) {
    const err = error as DatabaseError;
    let message =
      err.code === "42P01"
        ? tableNotExist(name)
        : `Элемент справочника "${name}_table" небыл удален`;

    responseHandler.error(req, res, error, message);
  }
};
