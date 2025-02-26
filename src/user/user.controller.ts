import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/user/customTypes';
import { GetJwtPayload } from './getUser.decorator';
import { PaginationQueryDto } from './dto/PaginationQuery.dto';
import { userUpdateDto } from './dto/userUpdate.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getUser(@GetJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.getUser(jwtPayload.sub);
  }

  @Get()
  getUsers(@Query() query: PaginationQueryDto) {
    return this.userService.getUsers(query);
  }

  @Patch()
  updateUser(@Body() body: userUpdateDto) {
    return this.userService.updateUser(body);
  }
}
