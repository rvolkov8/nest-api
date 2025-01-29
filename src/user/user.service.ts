import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfoDto } from 'src/auth/dto/userInfo.dto';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOne(options: object[]) {
    return this.userRepository.findOne({ where: options });
  }

  save(userInfoDto: userInfoDto) {
    return this.userRepository.save(userInfoDto);
  }
}
