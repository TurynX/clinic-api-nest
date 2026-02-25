import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
