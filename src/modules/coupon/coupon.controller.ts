import type { UserDocument } from "./../../DB/models/user.model";
import { Body, Controller, Post } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { RoleEnum } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { User } from "src/common/decorators/credential.decorator";

@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Auth([RoleEnum.admin])
  @Post()
  async createCoupon(
    @User() user: UserDocument,
    @Body() couponData: CreateCouponDto,
  ) {
    return await this.couponService.createCoupon({ user, couponData });
  }
}
