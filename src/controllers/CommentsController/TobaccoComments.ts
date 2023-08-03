import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db, { CommentModels } from "../../models";
import responseHandler from "../../utils/responseHandler";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers.userId;
  const { tobaccoId, text } = req.body;
  try {
    const queryResult = await db.query(CommentModels.create("tobacco"), [
      uuidv4(),
      userId,
      tobaccoId,
      text,
    ]);

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
      return responseHandler.exception(
        req,
        res,
        406,
        `userId - ${userId} : попытка добавления более одного комментария для табака - ${tobaccoId}`,
        message
      );
    }

    responseHandler.error(req, res, error, "Комментарий не был создан");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, id } = req.body;
    const userId = req.headers.userId;

    const queryResult = await db.query(CommentModels.update("tobacco"), [
      text,
      id,
      userId,
    ]);

    const comment = queryResult.rows[0];

    if (!comment?.id) {
      const respMessage = "Комментарий не найден";
      return responseHandler.notFound(req, res, respMessage, respMessage);
    }

    const logText = `userId - ${userId} updated comment by ${comment.entityType} with id - ${comment.entityId}`;
    responseHandler.success(req, res, 201, logText, {
      success: true,
      message: "Комментарий успешно обновлен",
      body: comment,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Комментарий не был обновлен");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.body.id;
    const userId = req.headers.userId;

    const queryResult = await db.query(CommentModels.remove("tobacco"), [id]);

    const comment = queryResult.rows[0];

    if (!comment?.comment_id) {
      const respMessage = "Такой комментарий не найден";
      const logText = `комментарий - ${id} юзера - ${userId} - ${respMessage}`;
      return responseHandler.notFound(req, res, logText, respMessage);
    }

    await db.query(CommentModels.saveDeletedComment(), [
      uuidv4(), // deleted_id
      comment.comment_id,
      comment.user_id,
      comment.tobacco_id,
      "tobacco",
      comment.comment_text,
      comment.created_at,
      comment.updated_at,
    ]);

    const logText = `userId - ${userId} удалил комментарий табака - ${id}`;
    responseHandler.forRemoved(req, res, logText);
  } catch (error) {
    responseHandler.error(req, res, error, "Комментарий не был удален");
  }
};
