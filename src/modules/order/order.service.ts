import { CouponRepository } from "src/DB/repository/coupon.repository";
import type { UserDocument } from "./../../DB/models/user.model";
import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "src/DB/repository/order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly couponRepository: CouponRepository,
  ) {}

  async createOrder({
    user,
    orderData,
  }: {
    user: UserDocument;
    orderData: CreateOrderDto;
  }) {
    const code = orderData.coupon;
    if (code) {
      const isCouponExist = this.couponRepository.findOne({
        filter: { code },
      });
      if (!isCouponExist) {
        throw new NotFoundException("Coupon not found");
      }
      else if(isCouponExist.expired)
    }
  }
}
