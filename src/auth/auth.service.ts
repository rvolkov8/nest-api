import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { UserService } from 'src/features/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from 'src/common/utils/helpers';
import internal from 'stream';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(userInfoDto: UserInfoDto) {
    const { username, email } = userInfoDto;

    const user = await this.userService.findOne(
      [{ username }, { email }],
      true,
    );

    if (user) {
      if (user.deletedAt) {
        await this.userService.restore(user.id);

        const restoredUser = await this.userService.findOne([{ id: user.id }]);
        if (!restoredUser) {
          throw new InternalServerErrorException(
            'Failed to restore user. Please try again.',
          );
        }

        restoredUser.password = await hashPassword(userInfoDto.password);

        return this.userService.save(restoredUser);
      }

      throw new ConflictException(
        `User with such ${user.username === username ? 'username' : 'email'} already exists.`,
      );
    }

    const hashedPassword = await hashPassword(userInfoDto.password);

    return this.userService.save({ ...userInfoDto, password: hashedPassword });
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto) {
    const { username, password } = signInCredentialsDto;

    const user = await this.userService.findOne([{ username }]);

    if (!user) {
      throw new UnauthorizedException(
        'User with such username does not exist.',
      );
    } else {
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong password.');
      }
    }

    return {
      access_token: await this.jwtService.signAsync({ sub: user.id, username }),
    };
  }
}
