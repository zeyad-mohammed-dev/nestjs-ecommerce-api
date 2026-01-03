import { HydratedDocument, Types } from "mongoose";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Number, required: true })
  discount: number;

  @Prop({ type: Date, required: true })
  expiredIn: Date;

  @Prop({ type: Number, default: 0 })
  totalUsage: number;

  @Prop({ type: Number, default: 10 })
  maxUsage: number;
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "User",
  })
  createdBy: Types.ObjectId;
}
export type CouponDocument = HydratedDocument<Coupon>;

const couponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: couponSchema,
  },
]);
