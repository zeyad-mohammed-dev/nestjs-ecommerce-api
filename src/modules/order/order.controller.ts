import type { UserDocument } from "./../../DB/models/user.model";
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { RoleEnum } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/credential.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";

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
  @Auth([RoleEnum.admin, RoleEnum.user])
  @Post()
  async createOrder(
    @User() user: UserDocument,
    @Body() orderData: CreateOrderDto,
  ) {
    return await this.orderService.createOrder({ user, orderData });
  }
}
