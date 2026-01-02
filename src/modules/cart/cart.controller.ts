import type { UserDocument } from "./../../DB/models/user.model";
import { Body, Controller, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common";
import { User } from "src/common/decorators/credential.decorator";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post("add-to-cart")
  async addToCart(
    @User() user: UserDocument,
    @Body() productData: AddToCartDto,
  ) {
    return this.cartService.addToCart({ user, productData });
  }
}
