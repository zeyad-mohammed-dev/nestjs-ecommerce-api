import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { User, UserDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
