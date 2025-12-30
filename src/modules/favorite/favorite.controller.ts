import { Controller, Param, Post } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common";
import { User } from "src/common/decorators/credential.decorator";
import type { UserDocument } from "src/DB";
import { Types } from "mongoose";

@Controller("favorite")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post(":productId/toggle")
  async toggleFavorite(
    @User() user: UserDocument,
    @Param("productId") productId: Types.ObjectId,
  ) {
    return await this.favoriteService.toggleFavorite({ user, productId });
  }
}
