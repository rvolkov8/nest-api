import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { userInfoDto } from './dto/userInfo.dto';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(userInfoDto: userInfoDto) {
    const { username, email } = userInfoDto;

    const user = await this.userService.findOne([{ username }, { email }]);

    if (user) {
      throw new ConflictException(
        `User with such ${user.username === username ? 'username' : 'email'} already exists.`,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userInfoDto.password, salt);

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
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong password.');
      }
    }

    return {
      access_token: await this.jwtService.signAsync({ sub: user.id, username }),
    };
  }
}
