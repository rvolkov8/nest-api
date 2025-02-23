import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/user/customTypes';
import { GetJwtPayload } from './getUser.decorator';
import { PaginationQueryDto } from './dto/PaginationQuery.dto';
import { query } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@GetJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.getUser(jwtPayload.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUsers(@Query() query: PaginationQueryDto) {
    return this.userService.getUsers(query);
  }
}
