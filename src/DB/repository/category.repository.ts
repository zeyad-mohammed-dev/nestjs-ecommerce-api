import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Category, CategoryDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CategoryRepository extends DatabaseRepository<Category> {
  constructor(
    @InjectModel(Category.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
