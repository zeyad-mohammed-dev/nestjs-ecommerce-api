import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNotEmpty()
  @IsDate()
  expiredIn: Date;

  @IsNumber()
  maxUsage: number;
}
