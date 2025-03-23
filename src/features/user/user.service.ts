import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { User } from 'src/features/user/entity/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { hashPassword } from 'src/common/utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOne(options: object[]) {
    return this.userRepository.findOne({ where: options });
  }

  save(userInfoDto: UserInfoDto) {
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

  async updateUser(id: string, body: UserUpdateDto) {
    const { email, password, age, description } = body;

    const user = await this.findOne([{ id }]);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = await hashPassword(password);
    }
    if (age) {
      user.age = age;
    }
    if (description) {
      user.description = description;
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
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
