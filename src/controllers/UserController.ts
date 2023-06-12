import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import db from "../models/db";
import { jwtSectretKey } from "../secrets";
import { avatarsDirName } from "../constants";
import { fileFilter } from "../utils";
import responseHandler from "../utils/responseHandler";
import logger from "../logger/logger.service";

const storage: multer.StorageEngine = multer.diskStorage({
  destination: avatarsDirName,
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

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, login } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);

    const queryResult = await db.query(
      `
      INSERT INTO hookah.user_table (
        user_id,
        login,
        email,
        password_hash
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING user_id AS id
      `,
      [uuidv4(), login, email, passwordHash]
    );

    responseHandler.success(
      req,
      res,
      201,
      `userId - ${queryResult.rows[0]?.id}`,
      {
        success: true,
      }
    );
  } catch (error: any) {
    responseHandler.error(req, res, error, "Не удалось зарегистрироваться");
  }
};

export const auth = async (req: Request, res: Response) => {
  try {
    const login: string = req.body.login;

    const queryResult = await db.query(
      `
      SELECT
        user_id AS id,
        login,
        email,
        password_hash AS "passwordHash",
        role_code AS "roleCode",
        avatar_url AS "avatarUrl",
        CONCAT(created_at::text, 'Z') AS "createdAt",
        CONCAT(updated_at::text, 'Z') AS "updatedAt"
      FROM hookah.user_table WHERE login = $1
    `,
      [login]
    );

    const user = queryResult.rows[0];

    if (!user) {
      const message: string = "Неверный логин или пароль";

      responseHandler.exception(
        req,
        res,
        404,
        `${login} - ${message}`,
        message
      );
      return;
    }

    const isValid: boolean = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValid) {
      const message: string = "Неверный логин или пароль";
      responseHandler.exception(
        req,
        res,
        401,
        `${req.body.login} - ${message}`,
        message
      );
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtSectretKey,
      {
        expiresIn: "30d",
      }
    );

    delete user.passwordHash;

    responseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      data: { user, token },
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Не удалось авторизоваться");
  }
};

export const authById = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId;
    const queryResult = await db.query(
      `
      SELECT
        user_id AS id,
        login,
        email,
        password_hash AS "passwordHash",
        role_code AS "roleCode",
        avatar_url AS "avatarUrl",
        CONCAT(created_at::text, 'Z') AS "createdAt",
        CONCAT(updated_at::text, 'Z') AS "updatedAt"
      FROM 
        hookah.user_table 
      WHERE 
        user_id = $1
    `,
      [userId]
    );

    const user = queryResult.rows[0];

    if (!user) {
      const message: string = "Пользователь не найден";
      responseHandler.exception(
        req,
        res,
        404,
        `userId - ${userId} : ${message}`,
        message
      );
      return;
    }

    delete user.passwordHash;

    responseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      body: user,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Нет доступа");
  }
};

export const saveAvatar = [
  upload.single("photo"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.id;
      const fileName = req.file?.filename;

      if (!fileName) {
        throw Error("Фото небыло сохранено");
      }

      const queryResult = await db.query(
        `
        WITH oldValue AS (
          SELECT avatar_url AS "avatarUrl" 
          FROM hookah.user_table 
          WHERE user_id = $2
        )
        UPDATE hookah.user_table 
        SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
        WHERE user_id = $2
        RETURNING (SELECT * FROM oldValue)`,
        [`uploads/avatars/${fileName}`, userId]
      );

      const oldAvatarUrl = queryResult.rows[0]?.avatarUrl;

      if (oldAvatarUrl) {
        const path = "./dist/" + oldAvatarUrl;
        fs.unlink(path, (err) => {
          if (err) logger.error(err.message);
        });
      }

      next();
    } catch (error) {
      responseHandler.error(req, res, error, "Не удалось сохранить аватар");
    }
  },
  authById,
];

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const queryResult = await db.query(
      `
      SELECT
        user_id AS id,
        login,
        email,
        role_code AS "roleCode",
        avatar_url AS "avatarUrl",
        CONCAT(created_at::text, 'Z') AS "createdAt",
        CONCAT(updated_at::text, 'Z') AS "updatedAt"
      FROM
        hookah.user_table
      WHERE
        user_id = $1
    `,
      [id]
    );

    const user = queryResult.rows[0];

    if (!user) {
      const message: string = "Пользователь не найден";
      responseHandler.exception(
        req,
        res,
        404,
        `userId - ${id} : ${message}`,
        message
      );
      return;
    }

    responseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      body: user,
    });
  } catch (error) {
    responseHandler.error(req, res, error, "Юзер не был найден");
  }
};

export const loginExists = async (req: Request, res: Response) => {
  try {
    const login = req.params.login;

    if (!login) {
      const message: string = "login отсутсвует";
      responseHandler.exception(req, res, 400, message, message);
      return;
    }

    const queryResult = await db.query(
      `SELECT user_id FROM hookah.user_table WHERE login = $1`,
      [login]
    );

    const user = queryResult.rows[0];

    responseHandler.success(
      req,
      res,
      200,
      `login "${login}" ${!!user ? "exist" : "not exist"}`,
      {
        success: true,
        body: {
          isExists: !!user,
        },
      }
    );
  } catch (error) {
    responseHandler.error(req, res, error, "Логин не проверен");
  }
};

export const emailExists = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    if (!email) {
      const message: string = "email отсутсвует";
      responseHandler.exception(req, res, 400, message, message);
      return;
    }

    const queryResult = await db.query(
      `SELECT user_id FROM hookah.user_table WHERE email = $1`,
      [email]
    );

    const user = queryResult.rows[0];

    responseHandler.success(
      req,
      res,
      200,
      `email "${email}" ${!!user ? "exist" : "not exist"}`,
      {
        success: true,
        body: {
          isExists: !!user,
        },
      }
    );
  } catch (error) {
    responseHandler.error(req, res, error, "Email не проверен");
  }
};

// export const getUserComments = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.params.id;

//    const comments = to get comments

//     const message: string = "Получен список комментариев";
//     responseHandler.success(req, res, 201, ``, {
//       success: true,
//       message,
//       body: comments,
//     });
//   } catch (error) {
//     responseHandler.error(req, res, error, "Комментарии не получены");
//   }
// };

export const getFavoritesTobaccoByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    const queryResult = await db.query(
      `
      SELECT
        tobacco_table.tobacco_id AS "id",
        tobacco_table.photo_url AS "photoUrl",
        tobacco_table.tobacco_name AS "name",
        tobacco_table.fabricator AS "fabricator"	
      FROM hookah.favorite_tobacco_table
      INNER JOIN hookah.tobacco_table ON tobacco_table.tobacco_id = favorite_tobacco_table.tobacco_id
      WHERE favorite_tobacco_table.user_id = $1 AND is_deleted = false
    `,
      [userId]
    );

    const tobaccoList = queryResult.rows;

    const message = "Список избранного успешно получен";
    responseHandler.success(
      req,
      res,
      201,
      `Получен списко избранных табаков пользователя`,
      {
        success: true,
        message,
        // TODO: найти как получать из БД данные сразу в нужном виде
        body: tobaccoList,
      }
    );
  } catch (error) {
    responseHandler.error(
      req,
      res,
      error,
      "Не был получен список избранных табаков"
    );
  }
};
