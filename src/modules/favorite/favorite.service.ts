import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { FavoriteRepository, ProductRepository, UserDocument } from "src/DB";

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async toggleFavorite({
    user,
    productId,
  }: {
    user: UserDocument;
    productId: Types.ObjectId;
  }) {
    const product = await this.productRepository.findById({ id: productId });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    const favorite = await this.favoriteRepository.findOneAndDelete({
      filter: { user: user._id, product: productId },
    });
    if (favorite) {
      return { message: "Removed from favorites" };
    }
    await this.favoriteRepository.create({
      data: [{ user: user._id, product: productId }],
    });
    return { message: "Added to favorites" };
  }
}
