import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { Images, RoleEnum, UploadImage } from "src/common";
import { User } from "src/common/decorators/credential.decorator";
import type { ProductDocument, UserDocument } from "src/DB";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth([RoleEnum.admin])
  @Post()
  @UploadImage({ folder: "product", multiple: true })
  async create(
    @Body() body: CreateProductDto,
    @Images() images: string[],
    @User() user: UserDocument,
  ): Promise<{
    message: string;
  }> {
    await this.productService.create({ body, images, user });
    return { message: "Done" };
  }

  @Auth([RoleEnum.admin, RoleEnum.user])
  @Get()
  async findAll(): Promise<{
    message: string;
    data: { products: ProductDocument[] };
  }> {
    const products = await this.productService.findAll();
    return { message: "Done", data: { products } };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
