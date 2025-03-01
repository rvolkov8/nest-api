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
import { JwtPayload } from 'src/user/customTypes';
import { GetJwtPayload } from './getUser.decorator';
import { paginationQueryDto } from './dto/paginationQuery.dto';
import { userUpdateDto } from './dto/userUpdate.dto';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Used to get the current user information' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get('me')
  getUser(@GetJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.getUser(jwtPayload.sub);
  }

  @ApiOperation({ summary: 'Used to get information of all users' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get()
  getUsers(@Query() query: paginationQueryDto) {
    return this.userService.getUsers(query);
  }

  @ApiOperation({ summary: 'Used to update the current user information' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Patch()
  updateUser(
    @GetJwtPayload() jwtPayload: JwtPayload,
    @Body() body: userUpdateDto,
  ) {
    return this.userService.updateUser(jwtPayload.sub, body);
  }

  @ApiOperation({ summary: 'Used to delete the current user' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Delete()
  @HttpCode(204)
  deleteUser(@GetJwtPayload() jwtPayload: JwtPayload) {
    return this.userService.deleteUser(jwtPayload.sub);
  }
}
