import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../models/db";
import responseHandler from "../utils/responseHandler";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers.userId;
  const { entityType, entityId, text } = req.body;
  try {
    const queryResult = await db.query(
      `
      INSERT INTO hookah.comment_table (
        comment_id,
        user_id, 
        entity_id, 
        entity_type, 
        comment_text
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING entity_id AS id
      `,
      [uuidv4(), userId, entityId, entityType, text]
    );

    const comment = queryResult.rows[0];

    const message = "Комментарий успешно сохранен";
    responseHandler.success(
      req,
      res,
      201,
      `commentId - ${comment.id} : ${message}`,
      {
        success: true,
        message,
        body: {
          id: comment.id,
        },
      }
    );
  } catch (error: any) {
    if (error?.detail?.indexOf("already exists") > -1) {
      const message = "Нельзя оставлять более одного комментария";
      responseHandler.exception(
        req,
        res,
        406,
        `userId - ${userId} : попытка добавления более одного комментария для ${entityType} - ${entityId}`,
        message
      );
      return;
    }

    responseHandler.error(req, res, error, "Комментарий не был создан");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, id } = req.body;
    const userId = req.headers.userId;

    const queryResult = await db.query(
      `
      UPDATE hookah.comment_table
      SET comment_text = COALESCE($1, comment_text),
        updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
      WHERE comment_id = $2 AND is_deleted = false
      RETURNING entity_type AS "entityType";

      `,
      [text, id]
    );

    const comment = queryResult.rows[0];

    if (!comment?.entityType) {
      const message = "Комментарий не найден";
      responseHandler.exception(req, res, 404, message, message);
      return;
    }

    responseHandler.success(
      req,
      res,
      200,
      `userId - ${userId} updated comment by ${comment.entityType} with id - ${comment.entityId}`,
      {
        success: true,
        message: "Комментарий успешно обновлен",
        body: comment,
      }
    );
  } catch (error) {
    responseHandler.error(req, res, error, "Комментарий не был обновлен");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(
      `
      UPDATE hookah.comment_table
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
      WHERE comment_id = $1 AND is_deleted = false
      RETURNING entity_type AS "entityType"
      `,
      [id]
    );

    const comment = queryResult.rows[0];

    if (!comment?.entityType) {
      const message = "Такой комментарий не найден";
      responseHandler.exception(
        req,
        res,
        404,
        `comment by commentId - ${id} from userId - ${userId} - ${message}`,
        message
      );
      return;
    }

    responseHandler.success(
      req,
      res,
      200,
      `userId - ${userId} deleted comment for ${comment.entityType} with id = ${id}`,
      {
        success: true,
        message: "Комментарий удален",
      }
    );
  } catch (error) {
    responseHandler.error(req, res, error, "Комментарий не был удален");
  }
};
