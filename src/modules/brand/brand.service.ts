import { BrandRepository } from "./../../DB/repository/brand.repository";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { Brand, UserDocument } from "src/DB";
import { Types } from "mongoose";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import fs from "fs/promises";

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async createBrand({
    body,
    image,
    user,
  }: {
    body: CreateBrandDto;
    image?: Express.Multer.File;
    user: UserDocument;
  }): Promise<string> {
    const brandData: Partial<Brand> = {
      name: body.name,
      image: image?.path,
      createdBy: user._id,
    };

    const isBrandExist = await this.brandRepository.findOne({
      filter: { name: body.name },
    });

    if (isBrandExist) {
      throw new BadRequestException("Brand already exists");
    }

    const brand = await this.brandRepository.create({ data: [brandData] });

    if (!brand) {
      throw new BadRequestException("Failed to create brand");
    }

    return "Done";
  }
  async updateBrand({
    id,
    body,
    image,
    user,
  }: {
    id: Types.ObjectId;
    body: UpdateBrandDto;
    image?: Express.Multer.File;
    user: UserDocument;
  }): Promise<string> {
    const brand = await this.brandRepository.findOne({
      filter: { _id: id, createdBy: user._id },
    });
    if (!brand) {
      throw new NotFoundException(
        "Brand not found or unAuthorized to update it",
      );
    }

    if (body.name && body.name !== brand.name) {
      const isNameExist = await this.brandRepository.findOne({
        filter: { name: body.name },
      });

      if (isNameExist) {
        throw new BadRequestException("Brand name already used");
      }
      brand.name = body.name;
    }
    if (image?.path) {
      if (brand.image) {
        await fs.unlink(brand.image);
      }
      brand.image = image.path;
    }

    await brand.save();

    return "Done";
  }
}
