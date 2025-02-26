import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfoDto } from 'src/auth/dto/userInfo.dto';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/PaginationQuery.dto';
import { userUpdateDto } from './dto/userUpdate.dto';
import * as bcrypt from 'bcrypt';

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

  getUser(id: string) {
    const user = this.findOne([{ id }]);

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  getUsers(options: PaginationQueryDto) {
    return this.paginate(options);
  }

  async updateUser(id: string, body: userUpdateDto) {
    const { email, password, age, description } = body;

    const user = await this.findOne([{ id }]);
    if (!user) {
      throw new InternalServerErrorException();
    }

    if (email) {
      user.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (age) {
      user.age = age;
    }
    if (description) {
      user.description = description;
    }

    await this.userRepository.save(user);

    return user;
  }

  private async paginate(
    options: PaginationQueryDto,
  ): Promise<{ items: User[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return { items, total };
  }
}
