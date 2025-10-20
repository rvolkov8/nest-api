import { Body, Controller, Post } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpCredentialsDto: UserInfoDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }
}
