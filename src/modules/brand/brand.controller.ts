import { Auth } from "src/common/decorators/auth.decorator";
import { BrandService } from "./brand.service";
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Image, RoleEnum, UploadImage } from "src/common";
import { User } from "src/common/decorators/credential.decorator";
import type { UserDocument } from "src/DB";
import { CreateBrandDto } from "./dto/create-brand.dto";
import type { Request } from "express";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { Types } from "mongoose";

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
  ): Promise<{ message: string }> {
    await this.brandService.createBrand({
      body,
      image,
      user,
    });
    return { message: "Done" };
  }

  @Auth([RoleEnum.admin])
  @Patch("/:id")
  @UploadImage()
  async updateBrand(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateBrandDto,
    @User() user: UserDocument,
    @Image() image?: Express.Multer.File,
  ): Promise<{ message: string }> {
    console.log({ id, body, image, user });
    await this.brandService.updateBrand({ id, body, image, user });
    return { message: "Done" };
  }
}
