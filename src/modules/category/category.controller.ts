import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Image, RoleEnum, UploadImage } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { User } from "src/common/decorators/credential.decorator";
import type { CategoryDocument, UserDocument } from "src/DB";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth([RoleEnum.admin])
  @Post()
  @UploadImage({ folder: "category" })
  async createCategory(
    @Body() body: CreateCategoryDto,
    @User() user: UserDocument,
    @Image() image?: Express.Multer.File,
  ): Promise<{ message: string }> {
    await this.categoryService.createCategory({ body, image, user });
    return { message: "Done" };
  }

  @Auth([RoleEnum.admin, RoleEnum.user])
  @Get("all")
  async allCategory(): Promise<{
    message: string;
    data: { categories: CategoryDocument[] };
  }> {
    const categories = await this.categoryService.allCategory();
    return { message: "Done", data: { categories } };
  }
}
