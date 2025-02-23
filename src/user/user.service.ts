import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfoDto } from 'src/auth/dto/userInfo.dto';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/PaginationQuery.dto';

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

  async paginate(
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
