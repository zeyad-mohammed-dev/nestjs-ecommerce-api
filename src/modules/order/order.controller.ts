import type { UserDocument } from "./../../DB/models/user.model";
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { RoleEnum } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/credential.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CheckoutParamsDto } from "./dto/checkout-params.dto";
import { Types } from "mongoose";
import type { Request } from "express";

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,

    // stopAtFirstError: true,
  }),
)
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("webhook")
  async webhook(@Req() req: Request) {
    await this.orderService.webhook(req);
    return { message: "Done" };
  }

  @Auth([RoleEnum.admin, RoleEnum.user])
  @Post()
  async createOrder(
    @User() user: UserDocument,
    @Body() orderData: CreateOrderDto,
  ) {
    return await this.orderService.createOrder({ user, orderData });
  }

  @Auth([RoleEnum.admin, RoleEnum.user])
  @Post(":orderId")
  async checkout(
    @Param() params: CheckoutParamsDto,
    @User() user: UserDocument,
  ) {
    const session = await this.orderService.checkout({
      orderId: params.orderId,
      user,
    });

    return { message: "Done", data: { session } };
  }

  @Auth([RoleEnum.admin])
  @Patch(":orderId")
  async cancelOrder(
    @Param() params: CheckoutParamsDto,
    @User() user: UserDocument,
  ) {
    const order = await this.orderService.cancelOrder({
      orderId: params.orderId,
      user,
    });
    return { message: "Done", data: { order } };
  }
}
