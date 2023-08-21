import jwt from "jsonwebtoken";
import { jwtSectretKey } from "../secrets";
import loggerService from "../logger/logger.service";

export const tokenDecoded = (token: string): "" | jwt.JwtPayload => {
  const tkn: string = (token || "").replace(/Bearer\s?/, "");

  if (!tkn) return "";

  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(tkn, jwtSectretKey);
    return typeof decoded !== "string" ? decoded : "";
  } catch (error) {
    loggerService.error(error, tkn);
    return "";
  }
};

export const getUserIdFromToken = (token?: string): string | null => {
  if (!token) return null;

  const data = tokenDecoded(token);
  if (typeof data === "string") return null;

  return data.id;
};
