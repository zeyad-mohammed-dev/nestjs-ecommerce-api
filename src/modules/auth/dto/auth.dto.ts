import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IsMatch } from "src/common";

export class ResendConfirmEmailDto {
  @IsEmail()
  email: string;
}

export class ConfirmEmailDto extends ResendConfirmEmailDto {
  @Matches(/^\d{6}$/)
  code: string;
}

export class LoginBodyDto extends ResendConfirmEmailDto {
  @IsStrongPassword()
  password: string;
}

export class SignupBodyDto extends LoginBodyDto {
  @Length(2, 52, {
    message: "Username must be between 2 and 52 characters long",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ValidateIf((data: SignupBodyDto) => {
    return Boolean(data.password);
  })
  @IsMatch<string>(["password"], {
    message: "Passwords do not match",
  })
  confirmPassword: string;
}

export class SignupQueryDto {
  @MinLength(2)
  @IsString()
  flag: string;
}
