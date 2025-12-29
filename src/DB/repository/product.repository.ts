import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Product, ProductDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ProductRepository extends DatabaseRepository<Product> {
  constructor(
    @InjectModel(Product.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
