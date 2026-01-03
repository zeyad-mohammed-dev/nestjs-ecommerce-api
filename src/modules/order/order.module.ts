import { CouponModel } from "./../../DB/models/coupon.model";
import { ProductRepository } from "./../../DB/repository/product.repository";
import { CartRepository } from "./../../DB/repository/cart.repository";
import { CouponRepository } from "src/DB/repository/coupon.repository";
import { OrderRepository } from "./../../DB/repository/order.repository";
import { OrderModel } from "./../../DB/models/order.model";
import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { CartModel } from "./../../DB/models/cart.model";
import { ProductModel } from "./../../DB/models/product.model";

@Module({
  imports: [OrderModel, CouponModel, CartModel, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    CouponRepository,
    CartRepository,
    ProductRepository,
  ],
})
export class OrderModule {}
