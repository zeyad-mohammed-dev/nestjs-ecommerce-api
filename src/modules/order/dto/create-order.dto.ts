import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { PaymentMethodEnum } from "./../../../DB/models/order.model";

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions?: string[];

  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentMethod?: PaymentMethodEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  coupon?: string;
}
