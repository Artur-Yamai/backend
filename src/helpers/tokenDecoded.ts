import jwt from "jsonwebtoken";
import { jwtSectretKey } from "../secrets";

export const tokenDecoded = (token: string) => {
  const tkn: string = (token || "").replace(/Bearer\s?/, "");

  if (!tkn) return "";

  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(tkn, jwtSectretKey);
    return typeof decoded !== "string" ? decoded : "";
  } catch (_) {
    return "";
  }
};

export const getUserIdFromToken = (
  token: string | undefined
): string | null => {
  if (!token) return null;

  const data = tokenDecoded(token);
  if (typeof data === "string") return null;

  return data.id;
};
