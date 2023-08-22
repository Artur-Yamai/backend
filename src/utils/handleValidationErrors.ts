import { ValidationError, validationResult } from "express-validator";
import { Response, Request, NextFunction } from "express";
import ResponseHandler from "./responseHandler";

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsString = errors
      .array()
      .reduce((acc: string[], errorBody: ValidationError) => {
        return [...acc, errorBody.msg];
      }, [])
      .join(" | ");
    return ResponseHandler.exception(req, res, 400, errorsString, errorsString);
  }

  next();
};
