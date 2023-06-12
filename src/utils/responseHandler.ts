import { Request, Response, Router } from "express";
import chalk from "chalk";
import logger from "../logger/logger.service";

export default class ResponseHandler {
  public static success(
    req: Request,
    res: Response,
    statusCode: number,
    logText: string,
    body: any
  ): void {
    let method = this.getMethod(req.method.toLowerCase());
    logger.log(method, req.path, `\t${logText}`);

    res.status(statusCode).json({
      ...body,
    });
  }

  public static exception(
    req: Request,
    res: Response,
    statusCode: number,
    errorText: string = "",
    message: string = ""
  ) {
    let method = this.getMethod(req.method.toLowerCase());
    logger.warn(method, req.path, `\t${errorText}`);
    res.status(statusCode).json({
      success: false,
      message,
    });
  }

  public static error(
    req: Request,
    res: Response,
    error: any,
    text: string = ""
  ) {
    const message: string = `ОШИБКА СЕРВЕРА. ${text}`;
    let method = this.getMethod(req.method.toLowerCase());
    logger.error(method, req.path, `\t${message} \n`, error);
    res.status(500).json({
      success: false,
      message,
      error,
    });
  }

  private static getMethod(HTTPMehtod: string): string {
    const lowCase = HTTPMehtod.toUpperCase();
    switch (HTTPMehtod) {
      case "get":
        return chalk.blue(lowCase);
      case "put":
        return chalk.rgb(255, 165, 0)(lowCase);
      case "patch":
        return chalk.yellow(lowCase);
      case "delete":
        return chalk.red(lowCase);
      case "post":
        return chalk.green(lowCase);
      default:
        return lowCase;
    }
  }
}
