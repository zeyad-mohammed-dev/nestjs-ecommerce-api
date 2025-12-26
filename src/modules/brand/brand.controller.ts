import { Auth } from "src/common/decorators/auth.decorator";
import { BrandService } from "./brand.service";
import { Body, Controller, Post, Req } from "@nestjs/common";
import { Image, RoleEnum, UploadImage } from "src/common";
import { User } from "src/common/decorators/credential.decorator";
import type { UserDocument } from "src/DB";
import { CreateBrandDto } from "./dto/create-brand.dto";
import type { Request } from "express";

@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Auth([RoleEnum.admin])
  @Post()
  @UploadImage()
  async createBrand(
    @Body() body: CreateBrandDto,
    @User() user: UserDocument,
    @Image() image?: Express.Multer.File,
  ): Promise<string> {
    await this.brandService.createBrand(body, image || undefined, user);
    return "Done";
  }
}
