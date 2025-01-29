import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        [key: string]: string;
      }>(token, { secret: 'randomSecretExample' });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const header = request.headers.get('Authorization');

    if (!header) {
      return undefined;
    }

    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
