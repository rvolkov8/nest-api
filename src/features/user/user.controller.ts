import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/common/interfaces/custom-types';
import { getJwtPayload } from '../../common/decorators/get-jwt-payload.decorator';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getUser(@getJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.getUser(jwtPayload.sub);
  }

  @Get()
  getUsers(@Query() query: PaginationQueryDto) {
    return this.userService.getUsers(query);
  }

  @Patch()
  updateUser(
    @getJwtPayload() jwtPayload: JwtPayload,
    @Body() body: UserUpdateDto,
  ) {
    return this.userService.update(jwtPayload.sub, body);
  }

  @Delete()
  @HttpCode(204)
  deleteUser(@getJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.delete(jwtPayload.sub);
  }
}
