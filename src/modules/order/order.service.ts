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
import { OrderStatusEnum, PaymentMethodEnum } from "src/DB/models/order.model";
import { CheckoutParamsDto } from "./dto/checkout-params.dto";
import { PaymentService } from "src/common";
import { Types } from "mongoose";
import Stripe from "stripe";
import type { Request } from "express";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly couponRepository: CouponRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async webhook(req: Request) {
    const event = await this.paymentService.webhook(req);

    const orderId = (event.data.object.metadata as { orderId: string }).orderId;
    const order = await this.orderRepository.findOneAndUpdate({
      filter: {
        _id: Types.ObjectId.createFromHexString(orderId),
        paymentMethod: PaymentMethodEnum.CARD,
        orderStatus: OrderStatusEnum.PENDING,
      },
      update: { orderStatus: OrderStatusEnum.PAID },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    await this.paymentService.confirmPaymentIntent(order.intentId);

    return "Done";
  }
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

  async checkout({
    user,
    orderId,
  }: {
    user: UserDocument;
    orderId: Types.ObjectId;
  }) {
    console.log("In the Service");
    const order = await this.orderRepository.findOne({
      filter: {
        _id: orderId,
        userId: user._id,
        paymentMethod: PaymentMethodEnum.CARD,
        orderStatus: OrderStatusEnum.PENDING,
      },
      options: {
        populate: [
          {
            path: "items.productId",
          },
        ],
      },
    });

    console.log({ Order: order });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (order.discount) {
      const coupon = await this.paymentService.createCoupon({
        duration: "once",
        currency: "EGP",
        amount_off: order.discount * 100,
      });
      discounts.push({
        coupon: coupon.id,
      });
    }
    console.log({ orderId: orderId.toString() });
    const session = await this.paymentService.createCheckoutSession({
      customer_email: user.email,
      discounts,
      metadata: { orderId: orderId.toString() },
      line_items: order.items.map((product) => {
        return {
          quantity: product.quantity,
          price_data: {
            currency: "EGP",
            product_data: {
              name: (product.productId as unknown as Product).name,
            },
            unit_amount:
              (product.productId as unknown as Product).salePrice * 100,
          },
        };
      }),
    });
    console.log({ session });

    const intent = await this.paymentService.createPaymentIntent({
      amount: order.total,
      currency: "EGP",
    });

    order.intentId = intent.id;
    await order.save();

    return session;
  }
}
