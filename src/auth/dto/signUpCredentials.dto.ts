/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  password: string;

  @IsInt()
  @Min(14)
  @Max(120)
  age: number;

  @IsString()
  @MaxLength(1000)
  description: string;
}
