import { IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class AddToCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
