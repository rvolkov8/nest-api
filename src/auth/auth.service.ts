import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    const { username, email } = signUpCredentialsDto;

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (user) {
      throw new ConflictException(
        `User with such ${user.username === username ? 'username' : 'email'} already exists.`,
      );
    }

    const newUser = this.userRepository.create(signUpCredentialsDto);

    return this.userRepository.save(newUser);
  }
}
