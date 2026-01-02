import { Cart, CartDocument as TDocument } from "./../models/cart.model";
import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CartRepository extends DatabaseRepository<Cart> {
  constructor(
    @InjectModel("Cart")
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
