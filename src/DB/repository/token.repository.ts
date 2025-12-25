import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Token, TokenDocument } from "../models";

@Injectable()
export class TokenRepository extends DatabaseRepository<Token> {
  constructor(
    @InjectModel(Token.name)
    protected override readonly model: Model<TokenDocument>,
  ) {
    super(model);
  }
}
