import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/user/customTypes';
import { GetJwtPayload } from './getUser.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@GetJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.getUser(jwtPayload.sub);
  }
}
