import { Request, Response } from "express";
import chalk from "chalk";
import logger from "../logger/logger.service";

export default class ResponseHandler {
  public static forRemoved(req: Request, res: Response, logText: string): void {
    logger.log(this.getMethod("delete"), req.path, `\t${logText}`);
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
    const method = this.getMethod(req.method.toLowerCase());
    logger.log(method, req.path, `\t${logText}`);

    res.status(statusCode).json({ ...body });
  }

  public static exception(
    req: Request,
    res: Response,
    statusCode: number,
    exceptionText: string = "",
    message: string = ""
  ): void {
    let method = this.getMethod(req.method.toLowerCase());
    logger.warn(method, req.path, `\t${exceptionText}`);
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
