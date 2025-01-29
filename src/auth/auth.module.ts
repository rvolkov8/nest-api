import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'randomSecretExample',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
