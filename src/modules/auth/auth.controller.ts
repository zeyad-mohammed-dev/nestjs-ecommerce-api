import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import {
  ConfirmEmailDto,
  LoginBodyDto,
  ResendConfirmEmailDto,
  SignupBodyDto,
  SignupQueryDto,
} from "./dto/auth.dto";
import { LoginCredentialsResponse } from "src/common";
import { LoginResponse } from "./entities/auth.entity";

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,

    // stopAtFirstError: true,
  }),
)
@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("signup")
  async signup(
    @Body()
    body: SignupBodyDto,
  ): Promise<{
    message: string;
  }> {
    // console.log(body);
    await this.authenticationService.signup(body);
    return { message: "Done" };
  }

  @Post("resend-confirm-email")
  async resendConfirmEmail(
    @Body()
    body: ResendConfirmEmailDto,
  ): Promise<{
    message: string;
  }> {
    await this.authenticationService.resendConfirmEmail(body);
    return { message: "Done" };
  }

  @Patch("confirm-email")
  async confirmEmail(
    @Body()
    body: ConfirmEmailDto,
  ): Promise<{
    message: string;
  }> {
    await this.authenticationService.confirmEmail(body);
    return { message: "Done" };
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() body: LoginBodyDto): Promise<LoginResponse> {
    const credentials = await this.authenticationService.login(body);
    return { message: "Done", data: { credentials } };
  }
}
