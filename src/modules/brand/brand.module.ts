import { PreAuth } from "src/common/middleware/authentication.middleware";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { BrandModel, BrandRepository } from "src/DB";

@Module({
  imports: [BrandModel],
  providers: [BrandService,BrandRepository],
  controllers: [BrandController],
})
export class BrandModule {}
