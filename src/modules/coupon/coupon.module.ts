import { Module } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CouponController } from "./coupon.controller";
import { CouponModel } from "src/DB/models/coupon.model";
import { CouponRepository } from "src/DB/repository/coupon.repository";

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
})
export class CouponModule {}
