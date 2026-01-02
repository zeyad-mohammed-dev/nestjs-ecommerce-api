import { ProductModel } from "./../../DB/models/product.model";
import { ProductRepository } from "src/DB";
import { FavoriteRepository } from "src/DB/repository";
import { FavoriteModel } from "./../../DB/models/favorite.model";
import { Module } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";

@Module({
  imports: [FavoriteModel, ProductModel],
  providers: [FavoriteService, FavoriteRepository, ProductRepository],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
