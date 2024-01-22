import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  isEmail,
  isNotEmpty,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
