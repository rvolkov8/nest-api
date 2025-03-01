/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
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
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, example: 'email@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  @IsOptional()
  @ApiProperty({ required: false, example: 'bestpassword' })
  password: string;

  @IsInt()
  @Min(14)
  @Max(120)
  @IsOptional()
  @ApiProperty({ required: false, example: 20 })
  age: number;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiProperty({ required: false, example: 'This is a description' })
  description: string;
}
