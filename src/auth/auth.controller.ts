import { Body, Controller, Post } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }
}
