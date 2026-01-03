import { Order, OrderDocument as TDocument } from "./../models/order.model";
import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class OrderRepository extends DatabaseRepository<Order> {
  constructor(
    @InjectModel("Order")
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
