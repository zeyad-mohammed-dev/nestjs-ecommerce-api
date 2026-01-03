import { ProductModel } from "./../../DB/models/product.model";
import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "src/DB";
import { CategoryRepository } from "src/DB";
import { BrandRepository } from "src/DB";
import { CategoryModel } from "./../../DB/models/category.model";
import { BrandModel } from "./../../DB/models/brand.model";

@Module({
  imports: [ProductModel, CategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    BrandRepository,
  ],
})
export class ProductModule {}
