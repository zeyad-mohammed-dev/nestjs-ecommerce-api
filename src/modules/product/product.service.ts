import fs from "fs/promises";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  CategoryRepository,
  BrandRepository,
  ProductRepository,
  UserDocument,
  ProductDocument,
} from "src/DB";
import { Types } from "mongoose";

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create({
    body,
    images,
    user,
  }: {
    body: CreateProductDto;
    images: string[];
    user: UserDocument;
  }): Promise<string> {
    const [category, brand] = await Promise.all([
      this.categoryRepository.findById({ id: body.category }),
      this.brandRepository.findById({ id: body.brand }),
    ]);

    if (!category || !brand) {
      if (images) {
        images.forEach(async (image) => {
          await fs.unlink(image);
        });
      }
      throw new NotFoundException("Category or brand not found");
    }

    const product = await this.productRepository.create({
      data: [
        {
          name: body.name,
          brand: brand._id,
          category: category._id,
          discount: body.discount,
          originalPrice: body.originalPrice,
          descriptions: body.descriptions,
          stock: body.stock,
          createdBy: user._id,
          images: images,
        },
      ],
    });

    if (!product) {
      if (images) {
        images.forEach(async (image) => {
          await fs.unlink(image);
        });
      }
      throw new BadRequestException(
        "Fail to create product please try again later",
      );
    }
    return "Done";
  }

  async findAll(): Promise<ProductDocument[]> {
    const products = (await this.productRepository.find({
      filter: {},
    })) as ProductDocument[];
    if (!products) {
      throw new NotFoundException("No products found");
    }
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
