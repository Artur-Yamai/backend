import { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { tobaccoDirName } from "../constants";
import { fileFilter } from "../utils";
import db from "../models/db";
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

      const { name, fabricator, description } = body;

      const queryResult = await db.query(
        `
        INSERT INTO hookah.tobacco_table (
          tobacco_id,
          tobacco_name,
          fabricator,
          tobacco_description,
          user_id,
          photo_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        ) RETURNING tobacco_id AS id
        `,
        [
          uuidv4(),
          name,
          fabricator,
          description,
          userId,
          `uploads/tobaccos/${fileName}`,
        ]
      );

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
    const queryResult = await db.query(
      `
      SELECT
        tobacco_id AS id,
        photo_url AS "photoUrl",
        tobacco_name AS name,
        fabricator,
        (
          SELECT
            COALESCE(ROUND(SUM(rating_table.rating) / COUNT(rating_table.rating), 1), 0)
          FROM hookah.rating_table
          WHERE rating_table.entity_id = tobacco_table.tobacco_id
        ) AS rating
      FROM
        hookah.tobacco_table
      WHERE
        is_deleted = false
      `
    );

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

    const queryResult = await db.query(
      `
        SELECT
          tobacco_table.tobacco_id AS "id",
          tobacco_table.tobacco_name AS "name",
          tobacco_table.fabricator,
          tobacco_table.tobacco_description AS description,
          tobacco_table.photo_url AS "photoUrl",
          CONCAT(tobacco_table.created_at::text, 'Z') AS "createdAt",
          CONCAT(tobacco_table.updated_at::text, 'Z') AS "updatedAt",
          COALESCE($1 = (
            SELECT tobacco_id
            FROM hookah.favorite_tobacco_table
            WHERE user_id = $2 AND tobacco_id = $1
          ), false) AS "isFavorite",
          COALESCE((
            SELECT ROUND(SUM(rating) / COUNT(rating), 1)
            FROM hookah.rating_table
            WHERE hookah.rating_table.entity_id = $1
          ), 0) AS rating,
          (
            SELECT COUNT(rating)
            FROM hookah.rating_table
            WHERE hookah.rating_table.entity_id = $1
          ) AS "ratingsQuantity",
          COALESCE($2 = (
            SELECT user_id
            FROM hookah.rating_table
            WHERE entity_id = $1 AND user_id = $2
          ), false) AS "isRated",
          favorite_tobacco_table.user_id as "userId"
        FROM hookah.tobacco_table
        LEFT JOIN hookah.favorite_tobacco_table ON favorite_tobacco_table.tobacco_id = tobacco_table.tobacco_id
        WHERE tobacco_table.tobacco_id = $1 AND is_deleted = false
      `,
      [tobaccoId, userId]
    );

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
      console.log(fileName);
      const userId = req.headers.userId;

      const { name, fabricator, description, id } = req.body;

      if (fileName) {
        const queryResult = await db.query(
          `SELECT photo_url AS "photoUrl"
          FROM hookah.tobacco_table
          WHERE tobacco_id = $1
          `,
          [id]
        );

        oldPhotoUrl = queryResult.rows[0].photoUrl;
      }

      const queryResult = await db.query(
        `
        UPDATE 
          hookah.tobacco_table
        SET
          tobacco_name = COALESCE($1, tobacco_name),
          fabricator = COALESCE($2, fabricator),
          tobacco_description = COALESCE($3, tobacco_description),
          photo_url = COALESCE($4, photo_url),
          updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
        WHERE
          tobacco_id = $5
        RETURNING 
          tobacco_id AS id,
          tobacco_name AS name,
          fabricator,
          tobacco_description AS description,
          photo_url AS "photoUrl",
          user_id AS "userId",
          CONCAT(created_at::text, 'Z') AS "createdAt",
          CONCAT(updated_at::text, 'Z') AS "updatedAt",
          (
            SELECT
              COALESCE($5 = (
                SELECT tobacco_id
                FROM hookah.favorite_tobacco_table
                WHERE user_id = $6 AND tobacco_id = $5
              ), false) AS "isFavorite"
            FROM hookah.tobacco_table
            LEFT JOIN hookah.favorite_tobacco_table ON favorite_tobacco_table.tobacco_id = tobacco_table.tobacco_id
            WHERE tobacco_table.tobacco_id = $5 AND is_deleted = false
            ) AS "isFavorite"
      `,
        [
          name, // $1
          fabricator, // $2
          description, // $3
          fileName ? `uploads/tobaccos/${fileName}` : fileName, // $4
          id, // $5
          userId, // $6
        ]
      );

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

      // tobaccoClearData.isFavorite = !!(await FavoriteTobaccoModel.findOne({
      //   user: userId,
      //   tobacco: tobacco.id,
      // }));

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

    const queryResult = await db.query(
      `
      UPDATE
        hookah.tobacco_table
      SET
        is_deleted = true
      WHERE
        tobacco_id = $1
      RETURNING
        tobacco_id AS id,
        is_deleted AS "isDeleted"
    `,
      [id]
    );

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

    const queryResult = await db.query(
      `
      SELECT 
        comment_table.comment_id AS "id",
        comment_table.entity_id AS "tobaccoId",
        CONCAT(comment_table.created_at::text, 'Z') AS "createdAt",
        CONCAT(comment_table.updated_at::text, 'Z') AS "updatedAt",
        user_table.user_id AS "userId",
        user_table.login AS "userLogin",
        user_table.avatar_url AS "userAvatarUrl",
        comment_table.comment_text AS "text"    
      FROM hookah.comment_table
      INNER JOIN hookah.user_table ON comment_table.user_id = user_table.user_id
      WHERE comment_table.entity_id = $1 AND comment_table.is_deleted = false;
    `,
      [tobaccoId]
    );

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
