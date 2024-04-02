import JWT, { JwtPayload, SignOptions } from "jsonwebtoken";
import { AuthError } from "../errors";

interface JwtOption extends SignOptions {}

const DEFAULT_OPTIONS: JwtOption = {
  expiresIn: "1H",
};

export class Jwt {
  static genToken(payload: JwtPayload, option: JwtOption = DEFAULT_OPTIONS) {
    return JWT.sign(payload, process.env.SECRET_KEY!, option);
  }
  static verifyToken(token: string) {
    return JWT.verify(token, process.env.SECRET_KEY!, (error, decoded) => {
      if (!error) return decoded;
      throw new AuthError(error.message);
    });
  }
}
