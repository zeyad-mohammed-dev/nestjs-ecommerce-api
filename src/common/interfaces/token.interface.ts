import type { Request } from "express";
import { UserDocument } from "src/DB";
import { JwtPayload } from "jsonwebtoken";
import { TokenEnum } from "../enums";

export interface ICredentials {
  user: UserDocument;
  decoded: JwtPayload;
}

export interface IAuthRequest extends Request {
  credentials: ICredentials;
  tokenType: TokenEnum;
}
