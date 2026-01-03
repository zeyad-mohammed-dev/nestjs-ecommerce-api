import { Coupon, CouponDocument as TDocument } from "./../models/coupon.model";
import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CouponRepository extends DatabaseRepository<Coupon> {
  constructor(
    @InjectModel(Coupon.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
