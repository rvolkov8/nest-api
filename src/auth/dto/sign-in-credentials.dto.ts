/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @ApiProperty({ example: 'bestusername' })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  @ApiProperty({ example: 'bestpassword' })
  password: string;
}
