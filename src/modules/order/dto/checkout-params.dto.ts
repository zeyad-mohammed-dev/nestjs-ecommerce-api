import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CheckoutParamsDto {
  @IsMongoId()
  orderId: Types.ObjectId;
}
