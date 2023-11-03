import { Request, Response } from "express";
import chalk from "chalk";
import logger from "../logger/logger.service";

export default class ResponseHandler {
  public static forRemoved(req: Request, res: Response, logText: string): void {
    if (process.env.NODE_ENV === "production") {
      logger.logToFile("info", {
        path: req.method,
        method: "delete",
        message: logText,
      });
    } else {
      logger.log(this.getMethod(req.method), req.path, `\t${logText}`);
    }

    res.status(204).json();
  }

  public static notFound(
    req: Request,
    res: Response,
    logText: string,
    respMessage: string
  ): void {
    this.exception(req, res, 404, logText, respMessage);
  }

  public static success(
    req: Request,
    res: Response,
    statusCode: number,
    logText: string,
    body: any
  ): void {
    const method = this.getMethod(req.method);

    if (process.env.NODE_ENV == "production") {
      logger.logToFile("info", {
        path: req.path,
        method: req.method,
        message: logText,
        statusCode,
      });
    } else {
      logger.log(method, req.path, `\t${logText}`);
    }

    res.status(statusCode).json({ ...body });
  }

  public static exception(
    req: Request,
    res: Response,
    statusCode: number,
    exceptionText: string = "",
    message: string = ""
  ): void {
    let method = this.getMethod(req.method);

    if (process.env.NODE_ENV === "production") {
      logger.logToFile("warn", {
        path: req.path,
        method: req.method,
        message: message,
        statusCode: statusCode,
      });
    } else {
      logger.warn(method, req.path, `\t${exceptionText}`);
    }

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
  ): void {
    const message: string = `SERVER ERROR: ${text}`;
    let method = this.getMethod(req.method);

    if (process.env.NODE_ENV === "production") {
      logger.logToFile("error", {
        path: req.path,
        method: req.method,
        message: message,
      });
    } else {
      logger.error(method, req.path, `\t${message} \n`, error);
    }
    res.status(500).json({
      success: false,
      message,
      error,
      statusCode: 500,
    });
  }

  private static getMethod(HTTPMehtod: string): string {
    switch (HTTPMehtod) {
      case "GET":
        return chalk.blue(HTTPMehtod);
      case "PUT":
        return chalk.rgb(255, 165, 0)(HTTPMehtod);
      case "PATCH":
        return chalk.yellow(HTTPMehtod);
      case "DELETE":
        return chalk.red(HTTPMehtod);
      case "POST":
        return chalk.green(HTTPMehtod);
      default:
        return chalk.gray(HTTPMehtod);
    }
  }
}
