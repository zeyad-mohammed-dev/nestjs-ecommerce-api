import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Brand, BrandDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BrandRepository extends DatabaseRepository<Brand> {
  constructor(
    @InjectModel(Brand.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}

