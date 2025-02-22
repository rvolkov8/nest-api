import { Body, Controller, Post } from '@nestjs/common';
import { userInfoDto } from './dto/userInfo.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpCredentialsDto: userInfoDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }
}
