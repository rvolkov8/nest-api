/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class userUpdateDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  @IsOptional()
  password: string;

  @IsInt()
  @Min(14)
  @Max(120)
  @IsOptional()
  age: number;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description: string;
}
