import { SetMetadata } from "@nestjs/common";
import { TokenEnum } from "../enums";

export const tokenName: string = "tokenType";
export const Token = (type: TokenEnum = TokenEnum.access) => {
  return SetMetadata(tokenName, type);
};
