import { UserRepository } from "./../../DB/repository/user.repository";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  createNumericalOtp,
  emailEvent,
  IUser,
  LoginCredentialsResponse,
  OtpEnum,
  ProviderEnum,
  SecurityService,
} from "src/common";
import {
  ConfirmEmailDto,
  LoginBodyDto,
  ResendConfirmEmailDto,
  SignupBodyDto,
} from "./dto/auth.dto";
import { OtpRepository, UserDocument } from "src/DB";
import { Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/services/token.service";

@Injectable()
export class AuthenticationService {
  private User: IUser[] = [];
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly securityService: SecurityService,
    private readonly tokenService: TokenService,
  ) {}

  private async createConfirmEmailOtp(userId: Types.ObjectId) {
    await this.otpRepository.create({
      data: [
        {
          code: createNumericalOtp(),
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          type: OtpEnum.ConfirmEmail,
        },
      ],
    });
  }

  async signup(data: SignupBodyDto): Promise<string> {
    const { username, email, password } = data;
    const checkUserExist = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExist) {
      throw new ConflictException("email already exists");
    }
    const [user] = await this.userRepository.create({
      data: [{ username, email, password }],
    });

    if (!user) {
      throw new BadRequestException(
        "Failed to signup this account please try again later",
      );
    }

    await this.createConfirmEmailOtp(user._id);

    return "Done";
  }

  async login(data: LoginBodyDto): Promise<LoginCredentialsResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: ProviderEnum.SYSTEM,
      },
    });

    if (!user) {
      throw new NotFoundException("Fail to find matching account");
    }

    if (!(await this.securityService.compareHash(password, user.password))) {
      throw new NotFoundException("Fail to find matching account");
    }

    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return credentials;
  }

  async resendConfirmEmail(data: ResendConfirmEmailDto): Promise<string> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      filter: { email },
      options: {
        populate: [{ path: "otp", match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException("Fail to find matching account");
    }

    if (user.otp?.length) {
      throw new ConflictException(
        `Sorry we cannot grant you new OTP until the existing one expires,try again after :${user.otp[0].expiredAt.toISOString()}`,
      );
    }
    await this.createConfirmEmailOtp(user._id);

    return "Done";
  }

  async confirmEmail(data: ConfirmEmailDto): Promise<string> {
    const { email, code } = data;
    const user = await this.userRepository.findOne({
      filter: { email },
      options: {
        populate: [{ path: "otp", match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException("Fail to find matching account");
    }

    if (
      !(
        user.otp?.length &&
        (await this.securityService.compareHash(code, user.otp[0].code))
      )
    ) {
      throw new BadRequestException("Invalid OTP code");
    }
    user.confirmAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({ filter: { _id: user.otp[0]._id } });
    return "Done";
  }
}
