import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Favorite, FavoriteDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FavoriteRepository extends DatabaseRepository<Favorite> {
  constructor(
    @InjectModel("Favorite")
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
