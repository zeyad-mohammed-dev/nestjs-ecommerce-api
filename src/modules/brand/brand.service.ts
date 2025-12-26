import { BrandRepository } from "./../../DB/repository/brand.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { Brand, UserDocument } from "src/DB";

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async createBrand(
    body: CreateBrandDto,
    image: Express.Multer.File | undefined,
    user: UserDocument,
  ) {
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
  }
}
