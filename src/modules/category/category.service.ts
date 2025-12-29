import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CategoryDocument, CategoryRepository, UserDocument } from "src/DB";
import { CreateCategoryDto } from "./dto/create-category.dto";
import fs from "fs/promises";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory({
    body,
    image,
    user,
  }: {
    body: CreateCategoryDto;
    image?: Express.Multer.File;
    user: UserDocument;
  }) {
    const isNameExist = await this.categoryRepository.findOne({
      filter: { name: body.name },
    });
    if (isNameExist) {
      if (image?.path) {
        await fs.unlink(image.path);
      }
      throw new BadRequestException("Name is already exist");
    }

    const category = await this.categoryRepository.create({
      data: [
        {
          name: body.name,
          image: image?.path,
          createdBy: user._id,
        },
      ],
    });

    if (!category) {
      if (image?.path) {
        await fs.unlink(image.path);
      }
      throw new BadRequestException(
        "Fail to create category please try again later",
      );
    }

    return "Done";
  }
  async allCategory(): Promise<CategoryDocument[]> {
    const categories = (await this.categoryRepository.find({
      filter: {},
    })) as CategoryDocument[];
    if (!categories) {
      throw new NotFoundException("No categories found");
    }
    return categories;
  }
}
