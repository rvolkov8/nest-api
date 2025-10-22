import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { User } from 'src/features/user/entity/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { hashPassword } from 'src/common/utils/helpers';
import { CacheService } from 'src/common/modules/cache/cache.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  findOne(options: object[], withDeleted = false) {
    return this.userRepository.findOne({ where: options, withDeleted });
  }

  save(userInfoDto: UserInfoDto) {
    return this.userRepository.save(userInfoDto);
  }

  async restore(id: string) {
    const restoreResult = await this.userRepository.restore(id);

    if (restoreResult.affected === 0) {
      throw new InternalServerErrorException(
        'Failed to restore user. Please try again.',
      );
    }
  }

  async getUser(id: string) {
    const user = await this.findOne([{ id }]);

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  async getUsers(options: PaginationQueryDto) {
    const key = `users|page:${options.page}|limit:${options.limit}`;

    try {
      const cached = await this.cacheService.get(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn(`Cache GET failed for key "${key}": `, error.message);
    }

    const users = await this.paginate(options);

    try {
      await this.cacheService.set(key, users, 30_000);
    } catch (error) {
      console.warn(`Cache SET failed for key "${key}": `, error.message);
    }

    return users;
  }

  async update(id: string, body: UserUpdateDto) {
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

    await this.userRepository.update(id, user);

    return user;
  }

  async delete(id: string) {
    const result = await this.userRepository.softDelete(id);

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

  @Transactional()
  async transferToUsername(
    senderUsername: string,
    receiverUsername: string,
    amount: number,
  ) {
    if (senderUsername === receiverUsername) {
      throw new BadRequestException('Cannot transfer to the same user');
    }

    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    const username = [senderUsername, receiverUsername].sort();

    const senderUser = await this.userRepository.findOne({
      where: { username: username[0] },
      lock: { mode: 'pessimistic_write' },
    });

    if (!senderUser) {
      throw new NotFoundException(
        `Sender with username ${username[0]} not found.`,
      );
    }

    const receiverUser = await this.userRepository.findOne({
      where: { username: username[1] },
      lock: { mode: 'pessimistic_write' },
    });

    if (!receiverUser) {
      throw new NotFoundException(
        `Receiver with username ${username[1]} not found.`,
      );
    }

    const fromBalance = Number(senderUser.balance);
    const toBalance = Number(receiverUser.balance);

    if (fromBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    senderUser.balance = fromBalance - amount;
    receiverUser.balance = toBalance + amount;

    await this.userRepository.save([senderUser, receiverUser]);
  }
}
