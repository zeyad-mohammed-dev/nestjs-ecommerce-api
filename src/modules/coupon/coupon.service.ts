import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDocument } from "src/DB";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { CouponRepository } from "src/DB/repository/coupon.repository";

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}
  async createCoupon({
    user,
    couponData,
  }: {
    user: UserDocument;
    couponData: CreateCouponDto;
  }) {
    const isCouponExist = await this.couponRepository.findOne({
      filter: { code: couponData.code },
    });
    if (isCouponExist) {
      throw new BadRequestException("Coupon already exists");
    } else {
      const coupon = await this.couponRepository.create({
        data: [
          {
            ...couponData,
            createdBy: user._id,
          },
        ],
      });
      if (!coupon) {
        throw new BadRequestException("Failed to create coupon");
      }
      return "Coupon Created Successfully";
    }
  }
}
