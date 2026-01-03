import { Product, ProductDocument } from "./../../DB/models/product.model";
import { CouponRepository } from "src/DB/repository/coupon.repository";
import type { UserDocument } from "./../../DB/models/user.model";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "src/DB/repository/order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CouponDocument } from "src/DB/models/coupon.model";
import { CartDocument, CartRepository, ProductRepository } from "src/DB";
import { OrderStatusEnum } from "src/DB/models/order.model";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly couponRepository: CouponRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createOrder({
    user,
    orderData,
  }: {
    user: UserDocument;
    orderData: CreateOrderDto;
  }) {
    const code = orderData.coupon;
    let discountPercent = 0;
    if (code) {
      const coupon = (await this.couponRepository.findOne({
        filter: { code },
      })) as CouponDocument;
      if (!coupon) {
        throw new NotFoundException("Coupon not found");
      } else if (
        coupon.expiredIn < new Date(Date.now()) ||
        coupon.maxUsage == coupon.totalUsage
      ) {
        throw new BadRequestException("Coupon is expired");
      }
      discountPercent = coupon?.discount == 0 ? 0 : coupon?.discount / 100;
      coupon.totalUsage += 1;
      await coupon.save();
    }

    const userCart = (await this.cartRepository.findOne({
      filter: { userId: user._id },
      options: {
        populate: [
          {
            path: "items.productId",
            model: Product.name,
          },
        ],
      },
    })) as CartDocument;

    if (!userCart || userCart.items.length == 0) {
      throw new BadRequestException("Cart is empty");
    }
    const subTotal = userCart.items.reduce((acc, item) => {
      return (
        acc +
        (item.productId as unknown as ProductDocument).salePrice * item.quantity
      );
    }, 0);
    const discount = subTotal * discountPercent;
    const total = subTotal - discount;

    for (const item of userCart.items) {
      const product = (await this.productRepository.findById({
        id: item.productId,
      })) as ProductDocument;
      if (!product) {
        throw new NotFoundException("Product not found");
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException("Not enough stock");
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await this.orderRepository.create({
      data: [
        {
          userId: user._id,
          items: userCart.items,
          subTotal,
          discount,
          total,
          address: orderData.address,
          instructions: orderData.instructions,
          phone: orderData.phone,
          paymentMethod: orderData.paymentMethod,
          orderStatus: OrderStatusEnum.PENDING,
        },
      ],
    });

    await this.cartRepository.deleteOne({ filter: { userId: user._id } });

    return order;
  }
}
