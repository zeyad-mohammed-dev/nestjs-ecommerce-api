import { IsString, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  brand: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId;

  @IsNumber()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

  @IsString()
  @IsNotEmpty()
  descriptions: string;

  @IsNumber()
  stock: number;
}
