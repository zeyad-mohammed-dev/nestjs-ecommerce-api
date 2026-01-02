import { ProductRepository } from "./../../DB/repository/product.repository";
import { CartRepository } from "./../../DB/repository/cart.repository";
import { CartModel } from "./../../DB/models/cart.model";
import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { ProductModel } from "./../../DB/models/product.model";

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
})
export class CartModule {}
