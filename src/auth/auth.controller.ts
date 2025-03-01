import { Body, Controller, Post } from '@nestjs/common';
import { userInfoDto } from './dto/userInfo.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Used to create a new user' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiResponse({ status: 409 })
  @Post('signup')
  signUp(@Body() signUpCredentialsDto: userInfoDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @ApiOperation({ summary: 'Used to sign in a user' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }
}
