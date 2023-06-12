import jwt from "jsonwebtoken";
import { jwtSectretKey } from "../secrets";

export default (token: string) => {
  const tkn: string = (token || "").replace(/Bearer\s?/, "");

  if (!tkn) return "";

  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(tkn, jwtSectretKey);
    return typeof decoded !== "string" ? decoded : "";
  } catch (_) {
    return "";
  }
};
