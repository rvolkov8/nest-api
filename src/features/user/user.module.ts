import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/features/user/entity/user.entity';
import { CacheModule } from 'src/common/modules/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
