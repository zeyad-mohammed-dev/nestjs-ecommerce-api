import { Controller, Get, Headers, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser, RoleEnum, TokenEnum } from "src/common";
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
    @Headers() headers: any,
    @User()
    user: UserDocument,
  ): Observable<any> {
    console.log({ headers, user });

    // return { message: "Done" };
    return of([{ message: "Done" }]).pipe(delay(7000));
  }
  @Get("/all")
  allUsers(): { message: string; data: { users: IUser[] } } {
    const users: IUser[] = this.userService.allUsers();
    return { message: "Done", data: { users } };
  }
}
