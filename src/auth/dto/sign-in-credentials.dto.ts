/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(8)
  password: string;
}
