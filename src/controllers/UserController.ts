import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ip from "ip";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import db, { UserModels } from "../models";
import ResponseHandler from "../utils/responseHandler";
import { toDeleteFile } from "../helpers";
import { generatePassword, mailer } from "../utils";

config();

const IP = ip.address();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, login, refCode } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);
    const userId = uuidv4();

    const [queryResult] = await Promise.all([
      db.query(UserModels.register(), [userId, login, email]),
      db.query(UserModels.registerPassword(), [userId, passwordHash]),
    ]);

    const newUserId = queryResult.rows[0]?.id;

    if (!newUserId) throw "Пользователь небыл создан";

    await db.query(UserModels.saveNewRefRelation(), [refCode, newUserId]);

    ResponseHandler.success(req, res, 201, `userId - ${newUserId}`, {
      success: true,
    });
  } catch (error: any) {
    ResponseHandler.error(req, res, error, "Не удалось зарегистрироваться");
  }
};

export const auth = async (req: Request, res: Response) => {
  try {
    const login: string = req.body.login;

    const queryResult = await db.query(UserModels.auth(), [login]);

    const user = queryResult.rows[0];

    if (!user) {
      const respMessage: string = "Неверный логин или пароль";
      const logText: string = `${login} - ${respMessage}`;
      return ResponseHandler.notFound(req, res, logText, respMessage);
    }

    const PasswordQueryResult = await db.query(
      UserModels.getPasswordHashByUserId(),
      [user.id]
    );

    const passwordHash = PasswordQueryResult.rows[0].passwordHash;

    const isValid: boolean = await bcrypt.compare(
      req.body.password,
      passwordHash
    );

    if (!isValid) {
      const message: string = "Неверный логин или пароль";
      const logText: string = `${req.body.login} - ${message}`;
      ResponseHandler.exception(req, res, 401, logText, message);
      return;
    }

    const jwtSectretKey: string | undefined = process.env.JWT_SECRET_KEY;
    if (!jwtSectretKey) throw "JWT_SECRET_KEY is not defined";

    const token: string = jwt.sign({ id: user.id }, jwtSectretKey, {
      expiresIn: "60d",
    });

    ResponseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      data: { user, token },
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Не удалось авторизоваться");
  }
};

export const authById = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId;
    const queryResult = await db.query(UserModels.authById(), [userId]);

    const user = queryResult.rows[0];

    if (!user) {
      const respMessage: string = "Пользователь не найден";
      const logText: string = `userId - ${userId} : ${respMessage}`;
      return ResponseHandler.notFound(req, res, logText, respMessage);
    }

    ResponseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      body: user,
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Нет доступа");
  }
};

export const getListByAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId;
    const queryResult = await db.query(UserModels.getListByAllUsers());

    const userList = queryResult.rows;

    ResponseHandler.success(
      req,
      res,
      200,
      `userId - ${userId} получил список всех пользователей`,
      {
        success: true,
        body: userList,
      }
    );
  } catch (error) {
    ResponseHandler.error(req, res, error, "Список пользователей не получен");
  }
};

export const saveAvatar = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.id;
      const fileName = req.file?.filename;

      if (!fileName) throw Error("Фото небыло сохранено");

      const queryResult = await db.query(UserModels.saveAvatar(), [
        `uploads/avatars/${fileName}`,
        userId,
      ]);

      const oldPhotoUrl = queryResult.rows[0]?.avatarUrl;

      if (oldPhotoUrl) toDeleteFile(oldPhotoUrl);

      next();
    } catch (error) {
      ResponseHandler.error(req, res, error, "Не удалось сохранить аватар");
    }
  },
  authById,
];

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId;
    const { currentPass, newPass } = req.body;

    const queryResult = await db.query(UserModels.getPasswordHashByUserId(), [
      userId,
    ]);
    const currentPassHash = queryResult.rows[0]?.passwordHash;

    if (!currentPassHash) {
      const respMessage: string = "Пользователь не найден";
      const logText: string = `userId - ${userId} : ${respMessage}`;
      return ResponseHandler.notFound(req, res, logText, respMessage);
    }

    const isValid: boolean = await bcrypt.compare(currentPass, currentPassHash);

    if (!isValid) {
      const message: string = "Неверный текущий пароль";
      const logText: string = `${req.body.login} - ${message}`;
      ResponseHandler.exception(req, res, 401, logText, message);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newPassHash = await bcrypt.hash(newPass, salt);

    await db.query(UserModels.updatePasswordByUserId(), [newPassHash, userId]);

    ResponseHandler.success(
      req,
      res,
      200,
      `userId - ${userId} upadted password`,
      {
        success: true,
      }
    );
  } catch (error) {
    ResponseHandler.error(req, res, error, "Не удалось обновить пароль");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const queryResult = await db.query(UserModels.getUserById(), [id]);

    const user = queryResult.rows[0];

    if (!user) {
      const respMessage: string = "Пользователь не найден";
      const logText: string = `userId - ${id} : ${respMessage}`;
      return ResponseHandler.notFound(req, res, logText, respMessage);
    }

    ResponseHandler.success(req, res, 200, `userId - ${user.id}`, {
      success: true,
      body: user,
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Юзер не был найден");
  }
};

export const loginExists = async (req: Request, res: Response) => {
  try {
    const login = req.params.login;

    if (!login) {
      const message: string = "login отсутсвует";
      return ResponseHandler.exception(req, res, 400, message, message);
    }

    const queryResult = await db.query(UserModels.loginExists(), [login]);

    const user = queryResult.rows[0];

    const logText: string = `login "${login}" ${
      !!user ? "exist" : "not exist"
    }`;
    ResponseHandler.success(req, res, 200, logText, {
      success: true,
      body: { isExists: !!user },
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Логин не проверен");
  }
};

export const emailExists = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    if (!email) {
      const message: string = "email отсутсвует";
      ResponseHandler.exception(req, res, 400, message, message);
      return;
    }

    const queryResult = await db.query(UserModels.emailExists(), [email]);

    const user = queryResult.rows[0];

    const logText: string = `email "${email}" ${
      !!user ? "exist" : "not exist"
    }`;
    ResponseHandler.success(req, res, 200, logText, {
      success: true,
      body: { isExists: !!user },
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Email не проверен");
  }
};

export const refCodeExist = async (req: Request, res: Response) => {
  try {
    const refCode: string = req.params.refCode;

    if (!refCode) {
      const message: string = "refCode отсутсвует";
      ResponseHandler.exception(req, res, 400, message, message);
      return;
    }

    const queryResult = await db.query(UserModels.refCodeExist(), [refCode]);

    const user = queryResult.rows[0];

    const logText: string = `refCode "${refCode}" ${
      !!user ? "exist" : "not exist"
    }`;
    ResponseHandler.success(req, res, 200, logText, {
      success: true,
      body: { isExists: !!user },
    });
  } catch (error) {
    ResponseHandler.error(req, res, error, "Реферальный код не проверен");
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
//     ResponseHandler.success(req, res, 201, ``, {
//       success: true,
//       message,
//       body: comments,
//     });
//   } catch (error) {
//     ResponseHandler.error(req, res, error, "Комментарии не получены");
//   }
// };

export const getFavoritesTobaccoByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    const queryResult = await db.query(
      UserModels.getFavoritesTobaccoByUserId(),
      [userId]
    );

    const tobaccoList = queryResult.rows;

    const message = "Список избранного успешно получен";
    const logText = "олучен списко избранных табаков пользователя";
    ResponseHandler.success(req, res, 201, logText, {
      success: true,
      message,
      // TODO: найти как получать из БД данные сразу в нужном виде
      body: tobaccoList,
    });
  } catch (error) {
    const message: string = "Не был получен список избранных табаков";
    ResponseHandler.error(req, res, error, message);
  }
};

export const getFavoritesCoalByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const queryResult = await db.query(UserModels.getFavoritesCoalByUserId(), [
      userId,
    ]);

    const coalList = queryResult.rows;

    const message = "Список избранного успешно получен";
    const logText: string = "Получен списко избранных табаков пользователя";
    ResponseHandler.success(req, res, 201, logText, {
      success: true,
      message,
      body: coalList,
    });
  } catch (error) {
    const logText: string = "Не был получен список избранных углей";
    ResponseHandler.error(req, res, error, logText);
  }
};

export const setRole = async (req: Request, res: Response) => {
  const { newRole, id } = req.body;
  try {
    const queryResult = await db.query(UserModels.setRole(), [newRole, id]);

    const userData = queryResult.rows[0];

    if (userData && userData.roleCode == newRole) {
      const logText: string = `для userId - ${id} обновлена роль на ${newRole}`;
      ResponseHandler.success(req, res, 201, logText, {
        success: true,
        message: "Роль успешноизменена",
      });
    } else {
      const logText: string = `для userId - ${id} не была обновлена роль на ${newRole}`;
      ResponseHandler.success(req, res, 200, logText, {
        success: false,
        message: "Роль не была изменена",
      });
    }
  } catch (error) {
    const logText: string = `пользователю ${id} не удалось установить роль ${newRole}`;
    ResponseHandler.error(req, res, error, logText);
  }
};

export const sendNewPasswordByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const queryResult = await db.query(UserModels.getUserByEmail(), [email]);
    const userData = queryResult.rows[0];

    if (userData) {
      const newPassword: string = generatePassword();
      const salt = await bcrypt.genSalt(10);
      const passwordHash: string = await bcrypt.hash(newPassword, salt);

      const queryResult = await db.query(
        UserModels.updateThePasswordSentByEmail(),
        [passwordHash, userData.id]
      );

      if (queryResult.rows[0]) {
        const logText: string = "user finded";
        mailer({
          subject: `Новый пароль`,
          html: `
          <div>
            <p>Новый пароль - <b style="font-size:20px">${newPassword}</b> </p>
            <p 
              style="
                border-bottom: 1px solid gray;
                padding-bottom: 8px;
              "
            >Переход на сайт - <a href="${IP}:${process.env.PORT}">HookahDB</a> </p>
            <p>Если это Вы не понимаете что это за сообщение и для кого оно, то просто проигнорируйте его.</p>
          </div>
          `,
          to: userData.email,
        });

        ResponseHandler.success(req, res, 200, logText, {
          success: true,
          body: userData,
        });
      } else {
        const message: string = "Пароль не был изменен";
        ResponseHandler.exception(req, res, 404, message, message);
      }
    } else {
      const message: string = "Пользователь с такой почтой небыл найден";

      ResponseHandler.exception(req, res, 404, message, message);
    }
  } catch (error) {
    const logText: string = `Не удалось отправить новый пароль на email ${email}`;
    ResponseHandler.error(req, res, error, logText);
  }
};
