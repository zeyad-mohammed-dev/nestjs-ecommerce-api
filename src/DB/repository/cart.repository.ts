import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Cart, CartDocument as TDocument } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CartRepository extends DatabaseRepository<Cart> {
  constructor(
    @InjectModel(Cart.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
