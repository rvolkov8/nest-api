/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class userInfoDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @ApiProperty({ example: 'bestusername' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  @ApiProperty({ example: 'bestpassword' })
  password: string;

  @IsInt()
  @Min(14)
  @Max(120)
  @ApiProperty({ example: 20 })
  age: number;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({ example: 'This is a description' })
  description: string;
}
