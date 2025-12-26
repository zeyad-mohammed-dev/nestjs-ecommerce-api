import { Controller, Get, Headers, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { RoleEnum, TokenEnum } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/credential.decorator";
import { type UserDocument } from "src/DB";
import { PreferredLanguageInterceptor } from "src/common/interceptors";
import { delay, Observable, of } from "rxjs";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // // @Token(TokenEnum.refresh)
  // // @SetMetadata("roles", [RoleEnum.user])
  // @Roles([RoleEnum.user])
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)

  @UseInterceptors(PreferredLanguageInterceptor)
  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get()
  profile(
    @User()
    user: UserDocument,
  ): { message: string; profile: { user: UserDocument } } {
    return { message: "Done", profile: { user } };
  }

  @Auth([RoleEnum.admin])
  @Get("/all")
  async allUsers(): Promise<{
    message: string;
    data: { users: UserDocument[] };
  }> {
    const users = await this.userService.allUsers() as unknown as UserDocument[];
    return { message: "Done", data: { users } };
  }
}
